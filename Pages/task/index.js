import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image, TextInput } from 'react-native';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PrimaryButton } from '../../components';
import CApi from '../../lib/CApi';
import {  useDispatch } from 'react-redux'
import { setAccountId,setAccountType,setAccountEmail,setCounter,setInitialId,setInittialPage,clearTask } from '../../store/reducer/taskSlice';
function Task({ navigation, route }) {
    const task = useSelector((state) => state.task)
    // const { id } = route.params;
    useEffect(() => {
      if (route.params && route.params.id) {
        dispatch(setAccountId(route.params.id));
        finddata();
      }
        // Set account_type value when 'selecttype' changes in route.params
        // if (route.params && route.params.selecttype) {
        //   dispatch(setAccountType(route.params.selecttype));
        // }
      
  
      },[navigation,route.params, dispatch]);
    const [isLoading, setLoading]= React.useState(false)
    const dispatch = useDispatch()
    const finddata = async () => {
      try {
        const body = {
          dataSource: 'Cluster0',
          database: 'puppet_uas',
          collection: 'account',
          filter: {
            "_id": { "$oid": route.params.id }
        }

        };
  
        const { data } = await CApi.post('/action/find', body);
        if (data) {
          if (data.documents.length > 0) {
            dispatch(setAccountEmail(data.documents[0].email));
            dispatch(setAccountType(data.documents[0].account_type));
          } else {
            alert('No data found'); // Handle the case where no data is returned
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    const submitAccount = async () => {
    if (task.account_type == ''|| task.email == '' || task.initial_id == '' || task.initial_page == '' || task.counter == '') {
        alert('Please fill in all required fields.');
         return;
        }
    if(!/\S+@\S+\.\S+/.test(task.email)){
        alert('Email is in valid.');
        return;
        }
      try{
        setLoading(true)
        const body= {
          "dataSource": "Cluster0",
          "database": "puppet_uas",
          "collection": "task",
          "document": task
        }
        const respose = await CApi.post('/action/insertOne',body)
        setLoading(false)
        if(respose) {
          alert('Data Account berhasil ditambahkan')
          dispatch(clearTask());
        }
      }catch(error){
        setLoading(false)
        console.error('error',error)
        alert(error.message)
      }
      
    }
  return (
    <SafeAreaView style={{  flex: 1,}}>
      <ScrollView>
        <View style={{   margin: 35,}} >
          <View style={[style.row]}>
            <View>
            <Text style={style.Text}>Account Type</Text>
            </View>    
          </View>
          <View style={[style.row]}>
            <TextInput
            style={[style.input, {marginTop:10,width:200,backgroundColor:'#e8e8e8'}]}
            value={task.account_id}
            onChangeText={(val)=>dispatch(setAccountId(val))}
            placeholder="Select Type" 
            editable={false}
           />
            <PrimaryButton 
              style={{marginLeft:10,marginTop:10,backgroundColor: '#fca503',width:100}}
              onPress={() => navigation.navigate('Select_Task')}
             title="Select"
             />
          </View>
          <View style={[style.row,{marginTop:15}]}>
            <View>
            <Text style={style.Text}>Account Type</Text>
            <TextInput
            style={[style.input, {marginTop:10,backgroundColor:'#e8e8e8'}]}
            value={task.account_type}
            onChangeText={(val)=>dispatch(setAccountType(val))}
            placeholder="Input Account type"
            editable={false}/>
            </View>
          </View>
          <View style={[style.row,{marginTop:15}]}>
            <View>
            <Text style={style.Text}>Email</Text>
            <TextInput
            style={[style.input, {marginTop:10,backgroundColor:'#e8e8e8'}]}
            value={task.email}
            onChangeText={(val)=>dispatch(setAccountEmail(val))}
            placeholder="Input Email"
            editable={false}/>
            </View>
          </View>
          <View style={[style.row,{marginTop:15}]}>
            <View>
            <Text style={style.Text}>Initial Id</Text>
            <TextInput
            style={[style.input, {marginTop:10}]}
            value={task.initial_id}
            onChangeText={(val)=>dispatch(setInitialId(val))}
            placeholder="Input initial id"/>
            </View>
          </View>
          <View style={[style.row,{marginTop:15}]}>
            <View>
            <Text style={style.Text}>Initial Page</Text>
            <TextInput
            style={[style.input, {marginTop:10}]}
            value={task.initial_page}
            onChangeText={(val)=>dispatch(setInittialPage(val))}
            placeholder="Input Initial Page"/>
            </View>
          </View>
          <View style={[style.row,{marginTop:15}]}>
            <View>
            <Text style={style.Text}>counter</Text>
            <TextInput
            style={[style.input, {marginTop:10}]}
            value={task.counter}
            onChangeText={(val)=>dispatch(setCounter(val))}
            placeholder="Input counter"/>
            </View>
          </View>
      
            <PrimaryButton 
            style={{marginTop:40,backgroundColor: '#fca503'}}
             title="Save Data"
          onPress={submitAccount}
          />

           
      
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  Text: {
    flexDirection:'column',
    marginLeft:5,
    color: '#000000'

  },
  input:{
    flexDirection:'column',
    width:310,
    height: 40,
    paddingLeft:10,

    backgroundColor:'#ffffff'
  }
})




export default Task;
