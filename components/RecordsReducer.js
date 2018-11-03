import { combineReducers } from 'redux'

const INITIAL_STATE = {
    statistical_data: {
        current: 0,
        total_earned: 0,
        total_spent: 0,
    },
    data_records: [
        //{per date ang isang element sa data_records
            //date: '2018 Oct 31',
            //net: 0,
            //total_spent: 0,
            //items: [
                //inout: 'Earn' or 'Spend',
                //details: 'Example',
                //category: 'Food and Drinks' or 'Salary',
                //cost: 1000,
                //time: '22:34:22'
            //],[

            //]
        //},{

        //}
    ],
    categorical_records: {
        spend: {
            fooddrinks: {
                size: 0,
                cost: 0,
                spent_today: 0
            },
            bills: {
                size: 0,
                cost: 0,
                spent_today: 0
            },
            transportation: {
                size: 0,
                cost: 0,
                spent_today: 0
            },
            grocery: {
                size: 0,
                cost: 0,
                spent_today: 0
            },
            shoppingentertainment: {
                size: 0,
                cost: 0,
                spent_today: 0
            },
            maintenancerepair: {
                size: 0,
                cost: 0,
                spent_today: 0
            },
            healthmedication: {
                size: 0,
                cost: 0,
                spent_today: 0
            },
            lost: {
                size: 0,
                cost: 0,
                spent_today: 0
            },
            others: {
                size: 0,
                cost: 0,
                spent_today: 0
            },
        },
        earn: {
            salary: {
                size: 0,
                cost: 0,
                earned_today: 0
            },
            allowance: {
                size: 0,
                cost: 0,
                earned_today: 0
            },
            found: {
                size: 0,
                cost: 0,
                earned_today: 0
            },
            others: {
                size: 0,
                cost: 0,
                earned_today: 0
            }
        }
    }
}

const recordsReducer = (state = INITIAL_STATE,action) => {
    switch(action.type) {
        case 'ADD_RECORD':
            const {statistical_data,data_records,categorical_records} = state;
            if(data_records.length == 0 || data_records[0].date!=action.date){
                data_records.unshift(
                    {
                        date: action.date,
                        net: 0,
                        total_spent: 0,
                        items: []
                    }
                );
            }
            data_records[0].items.unshift(action.payload);
            statistical_data.current = parseFloat(statistical_data.current) + (action.payload.inout == 'Earn') ? action.payload.cost : (-1)* action.payload.cost ;
            statistical_data.total_earned = parseFloat(statistical_data.total_earned) + ((action.payload.inout == 'Earn') ? action.payload.cost : 0);
            statistical_data.total_spent = parseFloat(statistical_data.total_spent) + ((action.payload.inout == 'Spend') ? action.payload.cost : 0);

            if (action.payload.inout=='Earn') {
                data_records[0].net = parseFloat(data_records[0].net) + action.payload.cost;
            }
            else{
                data_records[0].net = parseFloat(data_records[0].net) + (action.payload.cost*-1)
                data_records[0].total_spent = parseFloat(data_records[0].total_spent) + action.payload.cost
            }

            switch(action.payload.category){
                case "Food & Drinks" : 
                    categorical_records.spend.fooddrinks.size++;
                    categorical_records.spend.fooddrinks.cost+= action.payload.cost;
                    break;
                case "Bills" : 
                    categorical_records.spend.bills.size++;
                    categorical_records.spend.bills.cost+= action.payload.cost;
                    break;
                case "Transportation" : 
                    categorical_records.spend.transportation.size++;
                    categorical_records.spend.transportation.cost+= action.payload.cost;
                    break;
                case "Grocery" : 
                    categorical_records.spend.grocery.size++;
                    categorical_records.spend.grocery.cost+= action.payload.cost;
                    break;
                case "Shopping/Entertainment" : 
                    categorical_records.spend.shoppingentertainment.size++;
                    categorical_records.spend.shoppingentertainment.cost+= action.payload.cost;
                    break;
                case "Maintenance/Repair" : 
                    categorical_records.spend.maintenancerepair.size++;
                    categorical_records.spend.maintenancerepair.cost+= action.payload.cost;
                    break;
                case "Health/Medication" : 
                    categorical_records.spend.healthmedication.size++;
                    categorical_records.spend.healthmedication.cost+= action.payload.cost;
                    break;
                case "Lost" : 
                    categorical_records.spend.lost.size++;
                    categorical_records.spend.lost.cost+= action.payload.cost;
                    break;
                case "Others" : 
                    if (action.payload.inout == "Spend"){
                        categorical_records.spend.others.size++;
                        categorical_records.spend.others.cost+= action.payload.cost;
                    }
                    else{
                        categorical_records.earn.others.size++;
                        categorical_records.earn.others.cost+= action.payload.cost;
                    }
                    break;
                case "Salary":
                    categorical_records.earn.salary.size++;
                    categorical_records.earn.salary.cost+= action.payload.cost;
                    break;
                case "Allowance" : 
                    categorical_records.earn.allowance.size++;
                    categorical_records.earn.allowance.cost+= action.payload.cost;
                    break;
                case "Found" : 
                    categorical_records.earn.found.size++;
                    categorical_records.earn.found.cost+= action.payload.cost;
                    break;
                default:
                    if (action.payload.inout == "Spend"){
                        categorical_records.spend.others.size++;
                        categorical_records.spend.others.cost+= action.payload.cost;
                    }
                    else{
                        categorical_records.earn.others.size++;
                        categorical_records.earn.others.cost+= action.payload.cost;
                    }
            }

            const newState = {statistical_data,data_records,categorical_records}
            return newState
        default: 
            return state
    }
}

export default combineReducers({
    records: recordsReducer,
})  

export const addRecord = (inout, details, category, cost) =>(
    {
        type: 'ADD_RECORD',
        date: new Date().toLocaleDateString().replace(/-/g,'/'),
        payload: {
            inout: inout,
            details: details,
            category: category,
            cost: cost,
            time: new Date().toLocaleTimeString()
        }
    }
)

//"Food & Drinks", "Bills", "Transportation", "Grocery", "Shopping/Entertainment", "Maintenance/Repair", "Health/Medication"