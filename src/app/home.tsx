import React, { useContext, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import estilos from '../styles/styles';
import { useRouter } from 'expo-router';
import AuthContext from '../firebase/authContext';
import * as ImagePicker from 'expo-image-picker';
import { getPosts, addPost } from '../firebase/service';

export default function Home() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUri, setLocalImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      // ignore for now
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    try {
      if (!user || !user.isAdmin) {
        Alert.alert('Apenas admin pode postar');
        return;
      }
      setUploading(true);
      // prefer localImageUri (picked from device), otherwise imageUrl (remote link)
      await addPost({ title, text, imageUri: localImageUri, imageUrl, authorId: user.id, authorName: user.nome });
      setModalVisible(false);
      setTitle('');
      setText('');
      setImageUrl('');
      setLocalImageUri(null);
      setUploading(false);
      await load();
    } catch (err) {
      Alert.alert('Erro', err.message || String(err));
    }
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permissão para acessar fotos é necessária.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!res.cancelled) {
      setLocalImageUri(res.uri);
    }
  }

  function renderItem({ item }) {
    return (
      <View style={{backgroundColor: '#fff', padding: 12, borderRadius: 10, marginVertical: 8}}>
        {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={{ height: 160, borderRadius: 8, marginBottom: 8 }} /> : null}
        <Text style={{fontWeight: '700', fontSize: 16}}>{item.title}</Text>
        <Text style={{color: '#333', marginTop: 6}}>{item.text}</Text>
        <Text style={{color: '#666', marginTop: 8, fontSize: 12}}>Por: {item.authorName}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.container}>
      <View style={{width: '92%'}}>
        <Text style={{fontSize: 20, fontWeight: '700', marginVertical: 12}}>Feed</Text>

        {user && user.isAdmin ? (
          <TouchableOpacity onPress={() => setModalVisible(true)} style={{marginBottom: 12}}>
            <Text style={{color: '#1C6885', fontWeight: '600'}}>Adicionar postagem</Text>
          </TouchableOpacity>
        ) : null}

        <FlatList
          data={posts}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={load}
        />

        <TouchableOpacity onPress={() => { logout(); router.replace('/login'); }} style={{marginTop: 12}}>
          <Text style={{color: '#1C6885', fontWeight: '600'}}>Sair</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide">
          <SafeAreaView style={estilos.container}>
            <View style={estilos.card}>
              <Text style={{fontWeight: '700', fontSize: 18, marginBottom: 8}}>Nova postagem</Text>
              <TextInput placeholder="Título" style={estilos.input} value={title} onChangeText={setTitle} />
              <TextInput placeholder="Texto" style={[estilos.input, {height: 120, textAlignVertical: 'top'}]} multiline value={text} onChangeText={setText} />
              <View style={{width: '100%'}}>
                <TouchableOpacity onPress={pickImage} style={{backgroundColor: '#e6f6f8', padding: 10, borderRadius: 8, marginBottom: 8}}>
                  <Text style={{color: '#1C6885', textAlign: 'center'}}>Selecionar imagem do dispositivo</Text>
                </TouchableOpacity>
                {localImageUri ? (
                  <Image source={{ uri: localImageUri }} style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 8 }} />
                ) : null}
                <Text style={{textAlign: 'center', marginBottom: 8}}>ou</Text>
                <TextInput placeholder="URL da imagem (opcional)" style={estilos.input} value={imageUrl} onChangeText={setImageUrl} autoCapitalize='none' />

                <TouchableOpacity onPress={handleAdd} style={{backgroundColor: '#3AA4BA', padding: 12, borderRadius: 10, marginTop: 12}} disabled={uploading}>
                  {uploading ? <ActivityIndicator color="#fff" /> : <Text style={{color: '#fff', fontWeight: '700', textAlign: 'center'}}>Publicar</Text>}
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => setModalVisible(false)} style={{marginTop: 12}}>
                <Text style={{color: '#1C6885', textAlign: 'center'}}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
