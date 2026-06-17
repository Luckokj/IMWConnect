import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Logo from '../components/Logo';
import Botao from '../components/Botao';
import estilos from '../styles/styles';
import AuthContext from '../firebase/authContext';

export default function login() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [emailOrNome, setEmailOrNome] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      await login({ emailOrNome, senha });
      router.replace('/home');
    } catch (err) {
      Alert.alert('Erro', err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
        <SafeAreaView style={estilos.container}>
          <Logo titulo="CONNECT" subtitulo="IMW OUTEIRO SANTO" />

          <View style={estilos.card}>
            <View style={estilos.inputContainer}>
              <Image
                style={estilos.iconeEmail}
                source={require('../../assets/logo/email.png')}
              />
              <TextInput
                style={estilos.input}
                placeholder="Email ou nome"
                placeholderTextColor="#6b8fa0"
                value={emailOrNome}
                onChangeText={setEmailOrNome}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={estilos.inputContainer}>
              <Image
                style={estilos.icone}
                source={require('../../assets/logo/cadeado.png')}
              />
              <TextInput
                style={estilos.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#6b8fa0"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
            </View>

            <TouchableOpacity>
              <Text style={estilos.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <Botao titulo={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />

            <View style={estilos.textoContainer}>
              <Text style={estilos.bottomText}>Não tem uma conta?</Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={{color: '#1C6885'}}> Crie agora!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
