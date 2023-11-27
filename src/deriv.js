// Smaller bundle size, dealing only with the low-level library
import DerivAPI from '@deriv/deriv-api';
import { find } from 'rxjs/operators'
import WebSocket from 'ws';

// app_id 1089 is for testing, create your own app_id and use it here.
// go to api.deriv.com to register your own app.
const app_id = 51526;
const token = 'oTFzEY0IoR4p1ax';
//const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`);
//const api = new DerivAPIBasic({ connection });

//api.ping().then(console.log);



if (!token) {
    console.error('DERIV_TOKEN environment variable is not set');
    process.exit(1);
}

const api = new DerivAPI({ endpoint: 'green.derivws.com', lang: 'EN', app_id: app_id });

async function main() {
    try {
        const account = await api.account(token);

        const { balance, currency } = account;

        console.log(`Your current balance is: ${balance.currency} ${balance.display}`);

        balance.onUpdate(() => {
            console.log(`Your new balance is: ${balance.currency} ${balance.display}`);
        });

        const contract = await api.contract({
            proposal: 1,
            subscribe: 1,
            symbol: "stpRNG",
            contract_type: "MULTDOWN",
            // contract_category: "multiplier",
            multiplier: 5000,
            currency: "USD",
            basis: "stake",
            amount: 50,
        });

        contract.onUpdate(({ status, payout, bid_price }) => {
            switch (status) {
                case 'proposal':
                    return console.log(
                        `Current payout: ${payout.currency} ${payout.display}`,
                    );
                case 'open':
                    return console.log(
                        `Current bid price: ${bid_price.currency} ${bid_price.display}`,
                    );
                default:
                    break;
            }
        });

        // Wait until payout is greater than USD 19
        // await contract.onUpdate()
        //     .pipe(find(({ payout }) => payout.value >= expected_payout)).toPromise();

        const buy = await contract.buy();
        setInterval(function () {
            return contract.sell(({ subscribe: 0 }))
        }, 5000)


        //console.log(buy.contract_id)

        //console.log(`Buy price is: ${buy.price.currency} ${buy.price.display}`);

        // Wait until the contract is sold 
        await contract.onUpdate().pipe(find(({ is_sold }) => is_sold)).toPromise();

        const { profit, status } = contract;

        console.log(`You ${status}: ${profit.currency} ${profit.display}`);
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection and exit
        api.basic.disconnect();
    }
}
main()
