//@ts-nocheck

const soap = require('soap');
const ADRES = 'https://tckimlik.nvi.gov.tr/service/kpspublic.asmx?WSDL';
const express = require('express')
const app = express()
const port = 3000
var bodyParser = require('body-parser')

// parse application/json
app.use(bodyParser.json())

app.post('/tcdogrula', (req, res) => {

    let degerler = {
        TCKimlikNo: req.body.Tc,
        Ad: req.body.FirstName,
        Soyad: req.body.LastName,
        DogumYili: req.body.DogumYili
    };

    soap.createClient(ADRES, (err, client) => {

        client.TCKimlikNoDogrula(degerler, (err, result) => {
            if (result.TCKimlikNoDogrulaResult) {
                console.log(`Doğru`)
                return res.status(200).json({ message: "Bilgiler Doğru" }); // 200 OK durumu
            } else {
                console.log(`Yanliş`)
                return res.json("Bilgiler Yanlis")
            }
        });

    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})