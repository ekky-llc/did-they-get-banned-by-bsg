const fs = require('fs');
const _ = require('lodash');

(async () => {
    let files = fs.readdirSync(`${__dirname}/raw`);
    let data = [];

    for (let i = 0; i < files.length; i++) {
        let banned_users = [];
        const file_to_read = files[i];
        const raw_data = fs.readFileSync(`${__dirname}/raw/${file_to_read}`, 'utf-8').split('\r\n').join(',').split(',');
        
        const [ year, month, day, nothing, filename, type ] = file_to_read.split('_');

        for (let i = 0; i < raw_data.length; i++) {
            const banned_user = raw_data[i];
            if (banned_user.length > 0) {

                banned_users.push({
                    name: banned_user,
                    date_banned: `${year}-${month}-${day}`,
                    type: type.replace('.csv', ''),
                })
            }
        }

        data.push(banned_users)        
    }

    data = _.flatMapDeep(data)

    const date = new Date().toISOString().replace('.','').split('T')[0]
    fs.writeFileSync(`${__dirname}/formatted/${date}.json`, JSON.stringify(data, null, 2), 'utf-8')
})()