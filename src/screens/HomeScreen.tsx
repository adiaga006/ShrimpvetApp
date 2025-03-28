import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const HomeScreen: React.FC = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="microscope" size={32} color={COLORS.primary} />
        <Text style={styles.headerText}>SHRIMPVET</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to ShrimpVet</Text>
        <Text style={styles.subtitle}>Aquatic Pathology Research Expert</Text>
        
        <View style={styles.iconRow}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="flask" size={28} color={COLORS.primary} />
            <Text style={styles.iconText}>Lab Tests</Text>
          </View>
          
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="bacteria" size={32} color={COLORS.primary} />
            <Text style={styles.iconText}>Diagnostics</Text>
          </View>
          
          <View style={styles.iconContainer}>
            <FontAwesome5 name="fish" size={28} color={COLORS.primary} />
            <Text style={styles.iconText}>Solutions</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Explore Services</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.apiButton]}
          onPress={() => navigation.navigate('ApiTest')}
        >
          <MaterialCommunityIcons name="database" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Test API Connection</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Advanced Aquaculture Solutions</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: SPACING.m,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.m,
  },
  welcomeText: {
    fontSize: FONT_SIZE.xxlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  subtitle: {
    fontSize: FONT_SIZE.large,
    color: COLORS.text,
    marginBottom: SPACING.xl,
    opacity: 0.8,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: SPACING.xl,
  },
  iconContainer: {
    alignItems: 'center',
    padding: SPACING.m,
  },
  iconText: {
    marginTop: SPACING.s,
    color: COLORS.text,
    fontSize: FONT_SIZE.medium,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderRadius: 8,
    elevation: 3,
    marginTop: SPACING.l,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  apiButton: {
    backgroundColor: '#4CAF50',
  },
  buttonIcon: {
    marginRight: SPACING.xs,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
  },
  footer: {
    padding: SPACING.m,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerText: {
    fontSize: FONT_SIZE.small,
    color: COLORS.text,
    opacity: 0.7,
  }
});

export default HomeScreen; 