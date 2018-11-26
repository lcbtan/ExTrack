import React, {Component} from 'react';

import { 
    Text, 
    View,
    FlatList,
    ScrollView,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addRecord } from './RecordsReducer.js';
import styles from './Style.js';
import AppNoLeftHeader from './AppNoLeftHeader.js';

class HomeScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            refreshing: false,
        };
    }

    getCurrent=()=>{
        return this.props.records.statistical_data.current;
    }

    getSpent=()=>{
        var date = new Date();
        date.setHours(0,0,0,0);
        if(this.props.records.data_records.length == 0
            || this.props.records.data_records[0].date.toLocaleDateString != date.toLocaleDateString)
            return 0;
        else
            return this.props.records.data_records[0].total_spent;
    }

    getHistoryItems=()=>{
        date = new Date();
        if(this.props.records.data_records.length == 0
            || this.props.records.data_records[0].date.toLocaleDateString != date.toLocaleDateString)
            return [];
        else {
            return this.props.records.data_records[0].items;
        }
    }

    getSpendRecords=()=>{
        const spendCategories = ["Food & Drinks", "Bills", "Transportation", "Grocery", "Shopping/Entertainment", "Maintenance/Repair", "Health/Medication", "Lost", "Others"];
        spendingRecord = [];

        for(x = 0; x < spendCategories.length; x++){
            spendingRecord.push({
                category: spendCategories[x],
                cost: 0,
            })
        }

        items = this.getHistoryItems();
        for(x = 0; x < items.length; x++){
            for(c = 0; c < spendingRecord.length; c++){
                if(spendingRecord[c].category === items[x].category){
                    spendingRecord[c].cost = spendingRecord[c].cost + items[x].cost;
                }
            }
        }
        return spendingRecord;
    }

    pesoString=(money,inout)=>{
        absValMoney = money;
        if(money < 0)
            absValMoney = -money;
        sentimo = Math.floor(absValMoney * 100) % 100;
        peso = Math.floor(absValMoney);
        pesoStr = '';
        sentimoStr = '';
        if(inout === "Spend" && money != 0){
            pesoStr = '-';
            sentimoStr = '-';
        }
        pesoStr = pesoStr + '₱' + peso + ".";
        sentimoStr = sentimoStr + sentimo + '¢';
        if(sentimo > 0){
            if(peso == 0){
                return sentimoStr;
            }
            if(sentimo < 10){
                pesoStr = pesoStr + "0" + sentimo;
                return pesoStr;
            }
            else{
                pesoStr = pesoStr + sentimo;
            }
        }
        else{
            pesoStr = pesoStr + "00";
        }
        return pesoStr;
    }
    
    renderSpentItem=(item)=>{
        return(
            <View style={
                [
                    styles.homeContainer,
                    {
                        flexDirection:'row',
                        marginTop:0,
                        flex:1,
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                    }
                ]}>
                <View style={
                    {
                        alignItems:'flex-start',
                        width:'70%'
                    }}>
                    <Text style={[styles.listItems,{flex:1}]}>
                        {item.category}
                    </Text>
                </View>
                <View style={{alignItems:'flex-end',width:'30%'}}>
                    <Text
                        style={
                            [
                                styles.listItems,item.cost > 0 ? styles.moneySpent:styles.moneyEarned,
                                {flex:1}
                            ]
                        }>
                        {this.pesoString(item.cost,"Spend")}
                    </Text>
                </View>
            </View>
        );
    }

    renderHistoryItem=(item)=>{
        return(
            <View style={[styles.background,{flex:1}]}>
                <View style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                    }}/>
                <View style={[styles.homeContainer,{flexDirection:'row',flex:1,marginTop:1}]}>
                    <View style={{alignItems:'flex-start', width:'70%'}}>
                        <Text style={[styles.listItems,{flex:1}]}>
                            {item.details}
                        </Text>
                    </View>
                    <View style={{alignItems:'flex-end', width:'30%'}}>
                        <Text style={[styles.listItems,{flex:1}]}>
                            {item.time}
                        </Text>
                    </View>
                </View>
                <View style={[styles.homeContainer,{flexDirection:'row',flex:2}]}>
                    <View style={{alignItems:'flex-start', width:'70%'}}>
                        <Text style={[styles.listItems,{flex:1}]}>
                            {item.category}
                        </Text>
                    </View>
                    <View style={{alignItems:'flex-end', width:'30%'}}>
                        <Text
                            style={
                                [
                                    styles.listItems,
                                    item.inout === 'Spend' ? styles.moneySpent:styles.moneyEarned,
                                    {flex:1}
                                ]
                                }>
                            {this.pesoString(item.cost,item.inout)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={{flex:1}}>
                {/*Header*/}
                <View style={[{flexDirection: 'column'}, Platform.select({
                    ios:{
                        height: 64,
                    },
                    android:{
                        height: 56,
                    }
                })]}>
                    <AppNoLeftHeader route={this.props.navigation.state.routeName} />
                </View>

                {/*Content*/}
                <ScrollView 
                    style={[styles.background,{flex:1}]}>
                    <View style={[styles.homeContainer,{flex:1}]}>
                        <Text style={[styles.welcome,{}]}>Current Money</Text>
                        <Text style={[styles.moneyDisplay,
                            this.getCurrent() <= 0 ? styles.moneySpent:styles.moneyEarned,{}]}>{this.pesoString(this.getCurrent(),"Earn")}</Text>
                    </View>
                    <View style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 2,
                        }}/>
                    <View style={[styles.homeContainer,{flex:1}]}>
                        <Text style={[styles.welcome,{}]}>Spent Today</Text>
                        <Text style={[
                            styles.moneyDisplay,
                            this.getSpent() > 0 ? styles.moneySpent:styles.moneyEarned,
                            {marginTop:0}
                            ]}>
                            {this.pesoString(this.getSpent(),"Spend")}
                        </Text>
                    </View>
                    <View style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 2,
                        }}/>
                    <View style={
                        [
                            styles.homeContainer,
                            {
                                borderBottomColor: 'black',
                                borderBottomWidth: 1,
                                flex:4,
                            }
                        ]}>
                        <Text style={styles.welcome}>Cumulative Spending Today</Text>
                    </View>
                    <FlatList
                            data={this.getSpendRecords()}
                            keyExtractor={(item)=>item.category}
                            renderItem={({item}) => this.renderSpentItem(item)}
                        />
                    <View style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 2,
                        }}/>
                    <View style={[styles.homeContainer, {flex:4}]}>
                        <Text style={styles.welcome}>Transaction History Today</Text>
                    </View>
                    <FlatList
                            data={this.getHistoryItems()}
                            keyExtractor={(item,index)=>item.category + " " + index}
                            renderItem={({item}) => this.renderHistoryItem(item)}
                        />
                    {/*  */}
                </ScrollView>
            </View>
        );
    }
}

const mapStatetoProps = (state) => {
  const { records } = state
  return { records }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addRecord,
  }, dispatch)
);

export default connect(mapStatetoProps, mapDispatchToProps)(HomeScreen)
