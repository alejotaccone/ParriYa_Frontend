import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8E8E93', 
    letterSpacing: 0.5,
    marginBottom: 15,
  },
  listContainer: {
    paddingRight: 20, 
  },
  itemContainer: {
    alignItems: 'center',
    marginRight: 20, 
  },
  circle: {
    width: 75,
    height: 75,
    borderRadius: 37.5, 
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4, 
    marginBottom: 8,
    overflow: 'hidden', 
  },
  image: {
    width: '70%',
    height: '70%',
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
});