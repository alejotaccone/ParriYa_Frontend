import { StyleSheet, View, ScrollView } from 'react-native';
import Header from '../../components/Header/Header';
import Banner from '../../components/Banner/Banner'; 
import Categorias from '../../components/CategoriasInicio/Categorias';
import MasVendidos from '../../components/MasVendidos/MasVendidos'; 

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* El Header queda afuera del ScrollView para que quede fijo arriba siempre */}
      <Header />      
      
      {/* Envolvemos el resto para que el usuario pueda deslizar hacia abajo */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Banner />
        <Categorias />
        <MasVendidos />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#F5F5F5', 
  },
  scrollContent: {
    paddingBottom: 30, // Le da un poco de aire al final para que el último producto no choque con la barra de abajo
  }
});
