import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E76F41', 
    paddingHorizontal: 20,
    paddingTop: 50, 
    paddingBottom: 25,
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
  },
  titleText: {
    fontSize: 32, 
    fontWeight: 'bold',
    color: '#4B2610', 
  },
  addressText: {
    fontSize: 16,
    color: '#4B2610',
    marginTop: 4,
  },
  grillLogo: {
    width: 60, 
    height: 60,
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: 20, 
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: 'white', 
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, 
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 15, 
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  favoritesButton: {
    backgroundColor: 'white', 
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});