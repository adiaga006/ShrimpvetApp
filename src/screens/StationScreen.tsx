import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { getStations, getLatestData } from '../services/api';

const StationScreen: React.FC = () => {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const stationsRes = await getStations();
        setStations(stationsRes);
      } catch (error) {
        console.error('Error fetching stations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  const handleViewLatestData = async (stationId: number) => {
    try {
      const data = await getLatestData(stationId);
      Alert.alert(
        'Latest Data',
        `Temperature: ${data.temperature}°C\npH: ${data.ph}\nDO: ${data.dissolved_oxygen} mg/L`
      );
    } catch (error) {
      console.error('Error fetching latest data:', error);
      Alert.alert('Error', 'Unable to fetch latest data for this station.');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleViewLatestData(item.id)}
      >
        <Text style={styles.buttonText}>Xem dữ liệu</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0047ab" />
        <Text>Đang tải danh sách trạm...</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal>
      <View>
        <View style={styles.headerRow}>
          <Text style={[styles.cell, styles.headerText]}>ID</Text>
          <Text style={[styles.cell, styles.headerText]}>Tên trạm</Text>
          <Text style={[styles.cell, styles.headerText]}>Hành động</Text>
        </View>
        <FlatList
          data={stations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cell: {
    width: 120,
    fontSize: 14,
    marginRight: 8,
  },
  headerText: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#0047ab',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
  },
});

export default StationScreen;