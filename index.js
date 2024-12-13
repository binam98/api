import express from 'express';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;

// Middleware برای پارس کردن JSON
app.use(express.json());

// مسیر برای دریافت تیکت و اطلاعات اکانت‌ها
app.post('/create-accounts', async (req, res) => {
    const { apiTicket, referralAccount, accounts } = req.body;
    const apiUrl = 'https://us-central1-hiveonboard.cloudfunctions.net';

    const requestPromises = accounts.map(account => {
        return axios.post(`${apiUrl}/createAccount`, {
            data: {
                username: account.username,
                publicKeys: {
                    owner: account.owner,
                    active: account.active,
                    posting: account.posting,
                    memo: account.memo
                },
                referrer: referralAccount,
                creator: null,
                ticket: apiTicket
            }
        });
    });

    try {
        // همه درخواست‌ها را به صورت همزمان ارسال می‌کنیم
        await Promise.all(requestPromises);
        res.status(200).send('All accounts have been created successfully.');
    } catch (error) {
        console.error('Error creating accounts:', error);
        res.status(500).send('Error creating accounts.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
