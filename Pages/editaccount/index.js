import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image, TextInput,Alert } from 'react-native';
import React, { useEffect,useState } from 'react';

import { useSelector } from 'react-redux';
import { PrimaryButton } from '../../components';
import CApi from '../../lib/CApi';
import {  useDispatch } from 'react-redux'

import { clearAccount, setAccountEmail, setAccountName, setAccountPassword, setAccountType } from '../../store/reducer/accoutSlice';
function EditListAcc({ navigation, route }) {
    const account = useSelector((state) => state.account)
    const [typeacc, setType] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userid, setId] = useState('')
    const { id } = route.params;
    useEffect(() => {
        FindData();
        // Set account_type value when 'selecttype' changes in route.params
        if (route.params && route.params.selecttype) {
          setType(route.params.selecttype);
        }
       
  
      },[navigation,route.params, dispatch]);
      const FindData = async () => {
        try {
          const body = {
            dataSource: 'Cluster0',
            database: 'puppet_uas',
            collection: 'account',
            filter: {
                "_id": { "$oid": id }
            }
          };
    
          const { data } = await CApi.post('/action/find', body);
          if (data) {
            if (data.documents.length > 0) {
            console.log(data.documents);
            setId(id);
            setType(data.documents[0].account_type);
            setName(data.documents[0].account_name);
            setEmail(data.documents[0].email);
            setPassword(data.documents[0].account_password);
            }
          }
        } catch (err) {
          console.error(err);
        }
      };
    const [isLoading, setLoading]= React.useState(false)
    const [isLoadingD, setLoadingD]= React.useState(false)
    const dispatch = useDispatch();
    const submitAccount = async () => {
    if (typeacc== ''|| name== '' || email == '' || password == '') {
        alert('Please fill in all required fields.');
         return;
        }
    if(!/\S+@\S+\.\S+/.test(email)){
        alert('Email is in valid.');
        return;
        }
      try{
        setLoading(true)
        const body= {
          "dataSource": "Cluster0",
          "database": "puppet_uas",
          "collection": "account",
          "filter": { "_id": { "$oid": userid } },
        "update": {
          "$set": {
            "account_type": typeacc,
            "account_name": name,
            "email": email,
            "account_password": password,
          }
        }
        }
        const res = await CApi.post('/action/updateOne',body)
      setLoading(false)
      if(parseInt(res.data.modifiedCount) > 0){
          setType(typeacc)
          setName(name)
          setEmail(email)
          setPassword(password)
      }
      Alert.alert( 'Success',
      'Data berhasil diupdate', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to the 'ListAcc' screen after the user clicks "OK"
            navigation.navigate('List_Acc');
          },
        },
      ]);
      
    }catch(error){
      setLoading(false)
      console.error(error)
    }
    }
    const validasiDelete = () => {
      Alert.alert(
        'Delete Account ',
        'yakin mau hapus?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => Delete() },
        ],
        { cancelable: false },
      );
    };
    const Delete = async () => {
        try{
          setLoadingD(true)
          const body= {
            "dataSource": "Cluster0",
            "database": "puppet_uas",
            "collection": "account",
            "filter": { 
              "_id": { "$oid": userid } },
       
          }
          const res = await CApi.post('/action/deleteOne',body)
          setLoadingD(false)

          Alert.alert( 'Success',
          'Data berhasil dihapus', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to the 'ListAcc' screen after the user clicks "OK"
              navigation.navigate('List_Acc');
            },
          },
        ]);
        
       
        
      }catch(error){
        setLoadingD(false)
        console.error(error)
      }
      }
   
  return (
    <SafeAreaView style={{    flex: 1,}}>
      <ScrollView>
        <View style={[style.container]} >
          <View style={[style.row]}>
            <View>
            <Text style={style.JudulText}>Account Type</Text>
            </View>    
          </View>
          <View style={[style.row]}>
            <TextInput
            style={[style.input, {marginTop:10,width:200,backgroundColor:'#f0eded'}]}
            value={typeacc}
            onChangeText={(text)=>setType(text)}
            placeholder="Account Type" 
            editable={false}
           />
            <PrimaryButton 
              style={{marginLeft:10,marginTop:10,backgroundColor: '#fca503',width:100}}
              onPress={() => navigation.navigate('Edit_Select_acc')}
             title="Select"
             />
          </View>
          <View style={[style.row,{marginTop:15,display: 'none'}]}>
            <View>
            <Text style={style.JudulText}>Id</Text>
            <TextInput
            style={[style.input, {marginTop:10}]}
            value={userid}
            onChangeText={(text)=>setId(text)}
            placeholder="Input Id"
            editable={false}/>
            
            </View>
          </View>
          <View style={[style.row,{marginTop:15}]}>
            <View>
            <Text style={style.JudulText}>Account Name</Text>
            <TextInput
            style={[style.input, {marginTop:10}]}
            value={name}
            onChangeText={(text)=>setName(text)}
            placeholder="Input Account Name"/>
            </View>
          </View>
          <View style={[style.row,{marginTop:15}]}>
            <View>
            <Text style={style.JudulText}>Email</Text>
            <TextInput
            style={[style.input, {marginTop:10}]}
            value={email}
            onChangeText={(text)=>setEmail(text)}
            placeholder="Input Email"/>
            </View>
          </View>
          <View style={[style.row,{marginTop:15}]}>
            <View>
            <Text style={style.JudulText}>Password</Text>
            <TextInput
            style={[style.input, {marginTop:10}]}
            value={password}
            onChangeText={(text)=>setPassword(text)}
            placeholder="Input Password"/>
            </View>
          </View>
    
            <PrimaryButton 
            style={{marginTop:40,backgroundColor: '#fca503'}}
             title="Update Data"
          onPress={submitAccount}
          />
           <PrimaryButton 
            style={{marginTop:20,backgroundColor: 'red'}}
             title="Delete Data"
          onPress={validasiDelete}
          />
 
      
      
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    margin: 35,
 
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  JudulText: {
    flexDirection:'column',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft:5,
    color: '#000000'

  },
  input:{
    flexDirection:'column',
    width:310,
    height: 40,
    backgroundColor:'#ffffff'
  }
})




export default EditListAcc;
