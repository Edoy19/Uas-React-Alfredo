import React, { useEffect, useState,useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, TextInput } from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import CApi from '../../lib/CApi';
import { useDispatch } from 'react-redux';
import { style } from 'deprecated-react-native-prop-types/DeprecatedViewPropTypes';

function ListAccount({ navigation }) {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>List Of Account</Text>
        </View>
      ),
    });
  }, [navigation]);
  useFocusEffect(
    useCallback(() => {
      // Fetch data again when the screen is focused
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const body = {
        dataSource: 'Cluster0',
        database: 'puppet_uas',
        collection: 'account',
      };

      const { data } = await CApi.post('/action/find', body);
      if (data) {
        if (data.documents.length > 0) {
          setData(data.documents);
        } else {
          alert('No data found'); // Handle the case where no data is returned
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    // Filter the data based on the search input
    if (searchInput == '') {
        fetchData();
        return;
      }
    try {
        const body = {
          dataSource: 'Cluster0',
          database: 'puppet_uas',
          collection: 'account',
          "filter": {
            "account_name":searchInput
           
        }
        };
  
        const { data } = await CApi.post('/action/find', body);
        if (data) {
          if (data.documents.length > 0) {
            setData(data.documents);
          } else {
            alert('No data found'); // Handle the case where no data is returned
          }
        }
      } catch (err) {
        console.error(err);
      }
  };

  return (
    <SafeAreaView style={{  flex: 1,}}>
      <ScrollView>
        <View style={[styles.row, { alignItems: 'center', justifyContent: 'center', margin: 20 }]}>
          <TextInput
            style={[styles.input, { marginTop: 10 }]}
            placeholder="Search"
            value={searchInput}
            onChangeText={(text) => setSearchInput(text)}
            onSubmitEditing={handleSearch}
          />
        </View>

        {/* Render the fetched data */}
        {data.map((item, index) => (
          <View key={index} style={[styles.row, { margin: 20, marginTop: 5, marginLeft: 38 }]}>
            <TouchableOpacity style={[styles.row, { justifyContent: 'center' }]} onPress={() => navigation.navigate('Edit_Account', { id: item._id })}>
            <MaterialCommunityIcons name="email-outline" size={40} color='black' style={style.boxcontent} />
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.maintext}>{item.account_name}</Text>
                
                <Text style={styles.subtext}>{item.email}</Text>
                <View style={styles.row}>
                <MaterialCommunityIcons name="image-text" size={20} color='black' />
                  <Text style={[styles.subtext, { marginLeft: 5 }]}>{item.account_type}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  input: {
    width: 310,
    height: 40,
 
    padding: 10,
    paddingLeft: 15,
  
    backgroundColor: '#ffffff',
  },
  maintext: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
    marginTop: 5,
  },
  subtext: {
    fontSize: 15,
    marginLeft: 10,
    color: '#7a7979',
  },
  boxcontent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d9d9d9',
    padding: 15,
    borderRadius: 10,
  },

});

export default ListAccount;
