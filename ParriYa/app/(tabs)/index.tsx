import { StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header/Header';
import Banner from '../../components/Banner/Banner'; 
import Categorias from '../../components/CategoriasInicio/Categorias';
import MasVendidos from '../../components/MasVendidos/MasVendidos'; 
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />      
      <Banner />
      <Categorias />
      <MasVendidos />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#F5F5F5', 
  },
});
