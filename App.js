import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, Alert, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [opinion, setOpinion] = useState('');
  const [rating, setRating] = useState(0); // Calificación de 1 a 5
  const [books, setBooks] = useState([]);

  useEffect(() => {
    console.log('imageUri ha cambiado:', imageUri);
  }, [imageUri]);

  const takePicture = async () => {
    // Verificar permisos antes de lanzar la cámara
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    console.log('Status de permisos de cámara:', status);
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara para capturar imágenes.');
      return;
    }
    // Lanzar la cámara para tomar la foto
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    console.log('Resultado de la cámara:', result);
    // Comprobar si la imagen fue capturada correctamente
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (uri) {
        setImageUri(uri);
        console.log('Imagen capturada:', uri);
      } else {
        console.log('No se obtuvo la URI de la imagen');
      }
    } else {
      console.log('La captura de la imagen fue cancelada');
    }
  };

  const pickImage = async () => {
    // Verificar permisos antes de acceder a la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('Status de permisos de galería:', status);
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a la galería para seleccionar una imagen.');
      return;
    }
    // Lanzar la galería para seleccionar la imagen
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    console.log('Resultado de la galería:', result);
    // Comprobar si se seleccionó una imagen correctamente
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (uri) {
        setImageUri(uri);
        console.log('Imagen seleccionada de la galería:', uri);
      } else {
        console.log('No se obtuvo la URI de la imagen');
      }
    } else {
      console.log('La selección de la imagen fue cancelada');
    }
  };

  const addBook = () => {
    console.log(`Título ingresado: '${title}'`);
    console.log(`Autor ingresado: '${author}'`);
    console.log(`Opinión ingresada: '${opinion}'`);
    console.log(`Calificación ingresada: '${rating}'`);
    console.log(`URI de la imagen: '${imageUri}'`);

    // Verificar si los datos están completos antes de agregar el libro
    if (!title.trim() || !author.trim() || !opinion.trim() || rating === 0 || !imageUri) {
      console.log('Datos faltantes:', { title, author, opinion, rating, imageUri });
      Alert.alert('Faltan datos', 'Por favor ingresa un título, un autor, una opinión, calificación y captura una imagen.');
      return;
    }

    setBooks((prevBooks) => [
      ...prevBooks,
      { id: Date.now().toString(), title, author, opinion, rating, imageUri },
    ]);

    setTitle('');
    setAuthor('');
    setOpinion('');
    setRating(0);
    setImageUri(null);
    console.log('Libro agregado:', { id: Date.now().toString(), title, author, opinion, rating, imageUri });
  };

  const handleRating = (rate) => {
    setRating(rate);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registra un libro</Text>

      <View style={styles.imageButtonsContainer}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Ionicons name="camera-outline" size={20} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Capturar portada</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Ionicons name="image-outline" size={20} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Seleccionar desde galería</Text>
        </TouchableOpacity>
      </View>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <Text style={styles.label}>Título:</Text>
      <TextInput
        placeholder="Título del libro"
        value={title}
        onChangeText={(text) => setTitle(text)}
        style={styles.input}
      />

      <Text style={styles.label}>Autor:</Text>
      <TextInput
        placeholder="Autor del libro"
        value={author}
        onChangeText={(text) => setAuthor(text)}
        style={styles.input}
      />

      <Text style={styles.label}>Reseña:</Text>
      <TextInput
        placeholder="Escribe una opinión sobre el libro"
        value={opinion}
        onChangeText={(text) => setOpinion(text)}
        style={[styles.input, styles.textArea]}
        multiline
      />

      <View style={styles.ratingContainer}>
        <Text>Calificación:</Text>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleRating(star)}>
            <Text style={styles.star}>{star <= rating ? '★' : '☆'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={addBook}>
        <Ionicons name="add-circle-outline" size={20} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Agregar libro</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Libros Registrados:</Text>
      <FlatList
        data={books}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <View style={styles.bookContainer}>
              <Image source={{ uri: item.imageUri }} style={styles.bookImage} />
              <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>{item.author}</Text>
                <Text style={styles.bookOpinion}>Opinión: {item.opinion}</Text>
                <Text style={styles.bookRating}>Calificación: {item.rating} estrellas</Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={styles.bookList}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ea',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#6200ea',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6200ea',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  star: {
    fontSize: 30,
    color: '#FFD700',
  },
  bookList: {
    marginTop: 20,
    width: '100%',
  },
  bookItem: {
    marginBottom: 15,
    padding: 10,
  },
  bookContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  bookImage: {
    width: 60,
    height: 90,
    borderRadius: 10,
    marginRight: 15,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#6200ea',
  },
  button: {
    borderRadius: 10,
    backgroundColor: '#6200ea',
    paddingVertical: 5,  // Disminuir el espacio vertical
    paddingHorizontal: 8, // Disminuir el espacio horizontal
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5, // Disminuir el espacio entre los botones
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,  // Disminuir el tamaño del texto
  },
});
