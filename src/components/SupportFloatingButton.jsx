import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SupportFloatingButton({ visible, onSelectOption }) {
  const [open, setOpen] = React.useState(false);

  if (!visible) return null;

  return (
    <>
      <TouchableOpacity style={styles.fab} onPress={() => setOpen(true)}>
        <MaterialCommunityIcons name="message-question" size={32} color="#fff" />
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Atención al Cliente</Text>
            <TouchableOpacity style={styles.optionBtn} onPress={() => { setOpen(false); onSelectOption('ai'); }}>
              <MaterialCommunityIcons name="robot" size={24} color="#2a7" />
              <Text style={styles.optionText}>Agente IA</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBtn} onPress={() => { setOpen(false); onSelectOption('whatsapp'); }}>
              <MaterialCommunityIcons name="whatsapp" size={24} color="#25D366" />
              <Text style={styles.optionText}>Whatsapp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setOpen(false)}>
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#2a7',
    borderRadius: 32,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 999,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    minWidth: 240,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '100%',
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#222',
  },
  closeBtn: {
    marginTop: 16,
    padding: 8,
  },
  closeText: {
    color: '#2a7',
    fontWeight: 'bold',
  },
});
