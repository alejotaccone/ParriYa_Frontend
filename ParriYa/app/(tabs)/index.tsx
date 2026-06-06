import { View, ScrollView } from 'react-native';
import Header from '../../components/Header/Header';
import Banner from '../../components/Banner/Banner'; 
import EstadoPedido from '../../components/EstadoPedido/EstadoPedido';
import Categorias from '../../components/CategoriasInicio/Categorias';
import MasVendidos from '../../components/MasVendidos/MasVendidos'; 
import { styles } from './index.styles';

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
        <EstadoPedido />
        <Categorias />
        <MasVendidos />
      </ScrollView>
    </View>
  );
}

