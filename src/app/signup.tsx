import React, {useState, useContext} from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Logo from '../components/Logo';
import estilos from '../styles/styles';
import Botao from '../components/Botao';
import AuthContext from '../firebase/authContext';
import { useRouter } from 'expo-router';

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    try {
      setLoading(true);
      await signup({ nome, email, senha });
      router.replace('/home');
    } catch (err) {
      Alert.alert('Erro', err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView contentContainerStyle={{alignItems: 'center', width: '100%'}}>
        <Logo titulo="CONNECT" subtitulo="Crie sua conta" />

        <View style={[estilos.card, {alignSelf: 'center'}]}>
          <View style={estilos.inputContainer}>
            <TextInput
              style={estilos.input}
              placeholder="Nome completo"
              placeholderTextColor="#6b8fa0"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={estilos.inputContainer}>
            <TextInput
              style={estilos.input}
              placeholder="Email"
              placeholderTextColor="#6b8fa0"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={estilos.inputContainer}>
            <TextInput
              style={estilos.input}
              placeholder="Senha"
              placeholderTextColor="#6b8fa0"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <Botao titulo={loading ? 'Criando...' : 'Criar conta'} onPress={handleCreate} disabled={loading} />

          <View style={estilos.textoContainer}>
            <Text style={estilos.bottomText}>Já tem conta?</Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={{color: '#1C6885'}}> Faça login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
