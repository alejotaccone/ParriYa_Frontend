import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  filtersContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chipActive: {
    backgroundColor: '#4B2610', 
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  chipTextActive: {
    color: 'white',
  },
});