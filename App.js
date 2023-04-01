import { StatusBar } from 'expo-status-bar';
import { useCallback, useState, useEffect } from 'react';
import { SelectList } from 'react-native-dropdown-select-list'
import { StyleSheet, Text, View } from 'react-native';
import api from './services/api';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  const [brandList, setBrandList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [yearList, setYearList] = useState([]);

  const [brand, setBrand] = useState(null);
  const [model, setModel] = useState(null);
  const [year, setYear] = useState(null);
  const [car, setCar] = useState(null);

  useEffect(() => {

    api.get("/carros/marcas")
    .then(function (response) {
      
      let arr = [];

      response.data.map((e) => {

        let brand = {}
        brand.key = e.codigo
        brand.value = e.nome

        arr.push(brand)
      })

      setBrandList(arr);
    })
    .catch(function (error) {

      console.log("Erro nas marcas");
    })

  }, [])

  useEffect(() => {

    console.log(brand);
    if(brand != null){
      
      setModel(null)
      setYear(null)
      setCar(null)

      api.get("/carros/marcas/" + brand +"/modelos")
        .then(function (response) {
          
          let arr = [];
          response.data.modelos.map((e) => {

            let model = {}
            model.key = e.codigo
            model.value = e.nome

            arr.push(model)
          })

          setModelList(arr);
        })
        .catch(function (error) {

          console.log("Erro no modelos");
      })
    }

  }, [brand])

  useEffect(() => {

    if(model != null){

    api.get("/carros/marcas/" + brand +"/modelos/" + model + "/anos")
    .then(function (response) {
      
      let arr = [];

      response.data.map((e) => {

        let year = {}
        year.key = e.codigo
        year.value = e.nome

        arr.push(year)
      })

      setYearList(arr);
    })
    .catch(function (error) {

      console.log("Erro nos anos");
    })
    }

  }, [model])

  useEffect(() => {

    if(year != null){

      api.get("/carros/marcas/" + brand +"/modelos/" + model + "/anos/" + year)
      .then(function (response) {

        setCar(response.data);
      })
      .catch(function (error) {

        console.log("Erro no carro final");
      })
    }

  }, [year])

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Text style={styles.headerText}>Tabela FIPE</Text>
      <StatusBar style="auto" />
      <View style={styles.selectContainer}>
        <SelectList 
          setSelected={(val) => setBrand(val)} 
          data={brandList}
          searchPlaceholder="Pesquisar"
          placeholder="Selecione uma marca"
          save="key"
          fontFamily='Poppins Regular'
          boxStyles={{
            backgroundColor: '#F6F1F1',
            marginTop: 50,
          }}
          dropdownStyles={{
            backgroundColor: '#F6F1F1',
          }}

        />
        {brand != null ?
          <SelectList 
            setSelected={(val) => setModel(val)} 
            data={modelList}
            defaultOption={modelList[0]}
            searchPlaceholder="Pesquisar"
            placeholder="Selecione um modelo"
            save="key"
            fontFamily='Poppins Regular'
            boxStyles={{
              backgroundColor: '#F6F1F1',
              marginTop: 20,
            }}
            dropdownStyles={{
              backgroundColor: '#F6F1F1',
            }}
          /> 
          : null
        }

        {model != null && brand != null ?
          <SelectList 
            setSelected={(val) => setYear(val)} 
            data={yearList}
            searchPlaceholder="Pesquisar"
            placeholder="Selecione o ano"
            save="key"
            fontFamily='Poppins Regular'
            boxStyles={{
              backgroundColor: '#F6F1F1',
              marginTop: 20,
            }}
            dropdownStyles={{
              backgroundColor: '#F6F1F1',
            }}
          /> 
          : null
        }
        </View>
        {
          car != null ?
          <View style={styles.textContainer}>
            <Text style={styles.resultText}>{ car.Modelo } { car.AnoModelo }</Text>
            <Text style={styles.resultText}>Combustível: { car.Combustivel }</Text>
            <Text style={styles.resultText}>Valor em {car.MesReferencia}: { car.Valor }</Text>
          </View>
          : ''
        }
    </View>
  );
}

const styles = StyleSheet.create({

    container: {

      backgroundColor: '#000000',
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    },
    headerText: {

      color: '#892CDC',
      fontFamily: 'Poppins Bold', 
      fontSize: 30,
      marginTop: 100
    },
    resultText: {

      color: '#F6F1F1',
      fontFamily: 'Poppins Bold', 
    },
    selectContainer:{

      width: '80%'
    },
    textContainer: {

      marginTop: 30,
      justifyContent: 'center',
      alignItems: 'center'
    }
});