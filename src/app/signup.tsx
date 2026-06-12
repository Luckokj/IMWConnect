import React, {useState} from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Logo from '../components/Logo';
import estilos from '../styles/styles';
import Botao from '../components/Botao';

export default function Signup() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView contentContainerStyle={{alignItems: 'center'}}>
        <Logo titulo="CONNECT" subtitulo="Crie sua conta" />

        <View style={estilos.card}>
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

          <Botao titulo="Criar conta" onPress={() => { /* placeholder */ }} />

          <View style={estilos.textoContainer}>
            <Text style={estilos.bottomText}>Já tem conta?</Text>
            <TouchableOpacity>
              <Text style={{color: '#1C6885'}}> Faça login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
