import { StyleSheet, Text, View, FlatList, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import fs from 'fs';

const App = () => {
  const apiKey = fs.readFileSync('Key.txt', 'utf8');
  const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions';
  const [data, setData] = useState<{ input: string; output: string; }[]>([]);
  const [input, setInput] = useState('');

  const handleChat = async () => {
    const prompt = input;
    try {
      const response = await axios.post(
        apiUrl,
        {
          prompt: prompt,
          max_tokens: 150,
          temperature: 0.9,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0.6,
          stop: ['\n', ' Human:', ' AI:'],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      const text = response.data.choices[0].text;
      setData([...data, { input: input, output: text }]);
      setInput('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.chatBox}>
            <Text style={styles.inputText}>{item.input}</Text>
            <Text style={styles.outputText}>{item.output}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type here"
        />
        <Button onPress={handleChat} title="Send" />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  chatBox: {
    padding: 10,
    margin: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  inputText: {
    color: 'blue',
  },
  outputText: {
    color: 'green',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    padding: 5,
  },
});