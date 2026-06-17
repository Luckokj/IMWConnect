import React, { useContext, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, Modal, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import estilos from '../styles/styles';
import { useRouter } from 'expo-router';
import AuthContext from '../firebase/authContext';
import * as ImagePicker from 'expo-image-picker';
import { getPosts, addPost, deletePost } from '../firebase/service';

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
      if (!title || !title.trim() || !text || !text.trim()) {
        Alert.alert('Erro', 'Título e texto são obrigatórios');
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
    // support both English and Portuguese field names that might exist in the DB
    const title = item.title || item.titulo || '';
    const body = item.text || item.texto || '';

    return (
      // make each feed card fill the parent width so title/text aren't squashed
      <View style={{backgroundColor: '#fff', padding: 12, borderRadius: 10, marginVertical: 8, width: '100%', minHeight: 120}}>
        {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 8 }} /> : null}
        <Text style={{fontWeight: '700', fontSize: 18, color: '#000'}}>{title || '(sem título)'}</Text>
        <Text style={{color: '#333', marginTop: 8}}>{body || '(sem texto)'}</Text>
        <Text style={{color: '#666', marginTop: 10, fontSize: 12}}>Por: {item.authorName || item.author || 'Autor'}</Text>
        {user && user.isAdmin ? (
          <TouchableOpacity onPress={() => {
            Alert.alert('Confirmar', 'Deseja excluir esta postagem?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Excluir', style: 'destructive', onPress: async () => { try { await deletePost(item.id); await load(); } catch (err) { Alert.alert('Erro', err.message || String(err)); } } },
            ]);
          }} style={{marginTop: 8}}>
            <Text style={{color: '#c62828', fontWeight: '700'}}>Excluir</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.container}>
      <View style={{width: '100%', alignItems: 'center'}}>
        <Text style={{fontSize: 20, fontWeight: '700', marginVertical: 12}}>Feed</Text>

        {user && user.isAdmin ? (
          <TouchableOpacity onPress={() => { console.log('opening modal'); setModalVisible(true); }} style={{marginBottom: 12}}>
            <Text style={{color: '#1C6885', fontWeight: '600'}}>Adicionar postagem</Text>
          </TouchableOpacity>
        ) : null}

        <FlatList
          data={posts}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={load}
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 4, alignItems: 'center' }}
        />

        <TouchableOpacity onPress={() => { logout(); router.replace('/login'); }} style={{marginTop: 12}}>
          <Text style={{color: '#1C6885', fontWeight: '600'}}>Sair</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide">
          <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <SafeAreaView style={estilos.container}>
              <View style={[estilos.card, {borderWidth: 1, borderColor: '#e2e8f0'}]}>
                <Text style={{fontWeight: '700', fontSize: 18, marginBottom: 8}}>Nova postagem</Text>
                <Text style={{color: '#334155', marginBottom: 6}}>Título</Text>
                <TextInput
                  autoFocus
                  placeholder="Título"
                  placeholderTextColor="#6b8fa0"
                  style={{backgroundColor: '#f8fafc', height: 48, borderRadius: 10, paddingHorizontal: 12, color: '#04334a', marginBottom: 8}}
                  value={title}
                  onChangeText={setTitle}
                />
                <Text style={{color: '#334155', marginBottom: 6}}>Texto</Text>
                <TextInput
                  placeholder="Texto"
                  placeholderTextColor="#6b8fa0"
                  style={{backgroundColor: '#f8fafc', height: 120, borderRadius: 10, paddingHorizontal: 12, textAlignVertical: 'top', color: '#04334a', marginBottom: 8}}
                  multiline
                  value={text}
                  onChangeText={setText}
                />
                <View style={{width: '100%'}}>
                  {/* Preview box: only URL supported (or previously-picked local uri but prefer URL) */}
                  <View style={{width: '100%', aspectRatio: 16/9, borderRadius: 8, backgroundColor: '#f1f5f9', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', marginBottom: 8}}>
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={{color: '#94a3b8'}}>Pré-visualização da imagem (cole uma URL válida)</Text>
                    )}
                  </View>

                  <Text style={{textAlign: 'center', marginBottom: 6}}>Cole o link da imagem (https://...)</Text>
                  <TextInput placeholder="URL da imagem (opcional)" placeholderTextColor="#6b8fa0" style={{...estilos.input, backgroundColor: '#f8fafc', height: 44, borderRadius: 8, paddingHorizontal: 12}} value={imageUrl} onChangeText={setImageUrl} autoCapitalize='none' />

                <TouchableOpacity onPress={handleAdd} style={{backgroundColor: '#3AA4BA', padding: 12, borderRadius: 10, marginTop: 12}} disabled={uploading}>
                  {uploading ? <ActivityIndicator color="#fff" /> : <Text style={{color: '#fff', fontWeight: '700', textAlign: 'center'}}>Publicar</Text>}
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => setModalVisible(false)} style={{marginTop: 12}}>
                <Text style={{color: '#1C6885', textAlign: 'center'}}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
