import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import estilos from '../styles/styles';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={estilos.container}>
      <View style={{width: '92%'}}>
        <Text style={{fontSize: 20, fontWeight: '700', marginVertical: 12}}>Bem-vindo ao IMWConnect</Text>
        <View style={{backgroundColor: '#fff', padding: 16, borderRadius: 12}}>
          <Text style={{marginBottom: 8}}>Aqui ficará o conteúdo principal do aplicativo.</Text>
          <TouchableOpacity onPress={() => router.replace('/login')} style={{marginTop: 6}}>
            <Text style={{color: '#1C6885', fontWeight: '600'}}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
