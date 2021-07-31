const fs = require('fs');
const classifier = require('./classifier.json');

const isDataInvalid = (height, weight) => {
    let isInvalid = false;

    if (!height || !weight || isNaN(height) || isNaN(weight || height <= 0 || weight <= 0)) {
        isInvalid = true;
    }

    return isInvalid;
}

findCategoryAndRisk = bmi => {
    const classification = classifier.find(values => {
        return (bmi <= values.Upper && bmi >= values.Lower);
    });

    return {
        BMI_Category: classification.BMI_Category,
        Health_Risk: classification.Health_Risk
    };
}

calculateBMI = user => {
    const height = user.HeightCm,
        weight = user.WeightKg;
    user.bmi = 0;

    if (isDataInvalid(height, weight)) {
        user.bmi = user.Health_Risk = user.BMI_Category = 'invalid/insufficient data provided';
        return;
    }

    user.bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
}

calculate = data => {
    this.overweightCount = 0;
    data.forEach(element => {
        calculateBMI(element);

        if (!isNaN(element.bmi)) {
            let categoryDetails = findCategoryAndRisk(element.bmi);
            element.BMI_Category = categoryDetails.BMI_Category;
            element.Health_Risk = categoryDetails.Health_Risk;
        }

        if (element.BMI_Category == 'Overweight') {
            this.overweightCount++;
        }
    });
}

const readFile = (filePath, callback) => {
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) return callback(err);
        callback(null, content);
    });
}

const parseData = (jsonData) => {
    try {
        const rawData = JSON.parse(jsonData);
        return rawData;
    } catch (err) {
        console.log('error while parsing json - invalid json provided', err);
        return 0;
    }
}

calculator = (dataFile = 'data.json', resultFile = 'result.json') => {
    if (!fs.existsSync(dataFile)) {
        console.log('please provide valid file paths');
        return 0;
    }
    
    readFile(dataFile, (err, content) => {
        if (err) {
            console.log('error while reading data', err);
            return;
        }
        const data = parseData(content);
        if (data == 0) return;
        calculate(data);
        fs.writeFile(resultFile, JSON.stringify(data, null, 2), err => {
            if (err) {
                console.log('error while writing data', err);
                return;   
            }
        });
    });
}
calculator();
module.exports = calculator;