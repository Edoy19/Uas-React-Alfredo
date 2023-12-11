import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image, TextInput } from 'react-native';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PrimaryButton } from '../../components';
import CApi from '../../lib/CApi';
import {  useDispatch } from 'react-redux'
import { clearAccount, setAccountEmail, setAccountName, setAccountPassword, setAccountType } from '../../store/reducer/accoutSlice';
function AccountScreen({ navigation, route }) {
    const account = useSelector((state) => state.account)
    useEffect(() => {
        // Set account_type value when 'selecttype' changes in route.params
        if (route.params && route.params.selecttype) {
          dispatch(setAccountType(route.params.selecttype));
        }
        navigation.setOptions({
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: 5,marginRight:10 }}
                onPress={() => {
                  // Custom logic when the back button is pressed
                  // For example, you can navigate to a different screen
                  navigation.navigate('Home');
                  dispatch(clearAccount());
                }}
              >
            
              </TouchableOpacity>
            ),
          
          });
  
      },[navigation,route.params, dispatch]);
    const [isLoading, setLoading]= React.useState(false)
    const dispatch = useDispatch()
    const submitAccount = async () => {
    if (account.account_type == ''|| account.account_name == '' || account.email == '' || account.account_password == '') {
        alert('Please fill in all required fields.');
         return;
        }
    if(!/\S+@\S+\.\S+/.test(account.email)){
        alert('Email is in valid.');
        return;
        }
      try{
        setLoading(true)
        const body= {
          "dataSource": "Cluster0",
          "database": "puppet_uas",
          "collection": "account",
          "document": account
        }
        const respose = await CApi.post('/action/insertOne',body)
        setLoading(false)
        if(respose) {
          alert('Data Account berhasil ditambahkan')
          dispatch(clearAccount());
        }
      }catch(error){
        setLoading(false)
        console.error('error',error)
        alert(error.message)
      }
      
    }
  return (
    <SafeAreaView style={{ flex: 1,borderWidth:1}}>
      <ScrollView>
      <View style={{  margin: 35,}} >
          <View style={[style.row]}>
            <View>
            <Text style={style.Text}>Account Type</Text>
            </View>    
          </View>
          <View style={[style.row]}>
            <TextInput
            style={[style.input, {marginTop:10,width:200,backgroundColor:'#f0eded',paddingLeft:8}]}
            value={account.account_type}
            onChangeText={(val)=>dispatch(setAccountType(val))}
            placeholder="Account Type" 
            editable={false}
           />
            <PrimaryButton 
              style={{marginLeft:10,marginTop:10,backgroundColor: '#fca503',width:100}}
              onPress={() => navigation.navigate('Select_acc')}
             title="Select"
             />
          </View>
          <View style={[style.row,{marginTop:15}]}>
            <View>
            <Text style={style.Text}>Account Name</Text>
            <TextInput
            style={[style.input, {marginTop:10, paddingLeft:8}]}
            value={account.account_name}
            onChangeText={(val)=>dispatch(setAccountName(val))}
            placeholder="Input Account Name"/>
            </View>
          </View>
          <View style={[style.row,{marginTop:15}]}>
            <View>
            <Text style={style.Text}>Email</Text>
            <TextInput
            style={[style.input, {marginTop:10,paddingLeft:8}]}
            value={account.email}
            onChangeText={(val)=>dispatch(setAccountEmail(val))}
            placeholder="Input Email"/>
            </View>
          </View>
          <View style={[style.row,{marginTop:15}]}>
            <View>
            <Text style={style.Text}>Password</Text>
            <TextInput
            style={[style.input, {marginTop:10,paddingLeft:8}]}
            value={account.account_password}
            onChangeText={(val)=>dispatch(setAccountPassword(val))}
            placeholder="Input Password"/>
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
    backgroundColor: '#ffffff',
    
  }
})




export default AccountScreen;
