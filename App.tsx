import React, {useState} from 'react';
import {
  NativeBaseProvider,
  Button,
  Box,
  Image,
  Text,
  Pressable,
} from 'native-base';
import {Alert, StyleSheet, ToastAndroid, View} from 'react-native';
import GradientText from './components/GradientText';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import UserForm from './components/UserForm';
import RNFS from 'react-native-fs';
import {Carousel} from 'react-native-basic-carousel';
import Clipboard from '@react-native-clipboard/clipboard';

const DEFAULT_IMAGE_URL =
  'https://repository-images.githubusercontent.com/229240000/2b1bba00-eae1-11ea-8b31-ea57fe8a3f95';

export default function App() {
  const [photo, setPhoto] = useState<Asset | undefined>(undefined);
  const [image, setImage] = useState(DEFAULT_IMAGE_URL);
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState([]);

  const getMetadata = async (metadata: Object) => {
    try {
      console.log({metadata});
      setLoading(true);

      var data = await RNFS.readFile(image, 'base64');

      const formdata = new FormData();
      formdata.append('image', data);

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      const imageURl = await (
        await fetch(
          'https://api.imgbb.com/1/upload?key=73594faa050b96f8586fd85613dbde5e',
          requestOptions,
        )
      )
        .json()
        .catch((error: any) => {
          console.log({error2: error});
        });

      const rawData = JSON.stringify({
        imageURL: imageURl.data.url,
        tags: metadata?.mood,
        context: metadata?.additinalInfo,
        lang: 'English',
        length: metadata?.length,
      });

      console.log('hello', {rawData});

      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const requestOptions2 = {
        method: 'POST',
        headers: myHeaders,
        body: rawData,
      };

      const captionData = await (
        await fetch(
          'https://felix.link/apps/captions/api/caption',
          requestOptions2,
        )
      ).json();

      setCaptions(captionData.captions);

      console.log(imageURl.data.url, captionData.captions);

      setLoading(false);
    } catch (error) {
      console.log({error3: JSON.stringify(error)});
    }
  };

  const ImagePicker = () => {
    let options: any = {
      storageOptions: {
        path: 'image',
      },
    };

    launchImageLibrary(options, response => {
      setImage(response?.assets?.[0]?.uri ?? DEFAULT_IMAGE_URL);
      setPhoto(response?.assets?.[0] ?? undefined);
    });
  };

  return (
    <NativeBaseProvider>
      <GradientText style={styles.title}>EyeSpeak</GradientText>
      <Image
        alt="uploaded image"
        mx={'auto'}
        source={{
          uri: image,
        }}
        size="xl"
        style={styles.imageStyle}
      />
      {captions.length === 0 && (
        <Button
          margin={'5'}
          _text={{fontSize: 'md', fontWeight: 'bold', color: 'black'}}
          background={'green.400'}
          _pressed={{backgroundColor: 'green.500'}}
          size={'lg'}
          onPress={ImagePicker}>
          Pick Image
        </Button>
      )}
      {captions.length === 0 && image !== DEFAULT_IMAGE_URL && (
        <Box alignItems="center">
          <UserForm setData={getMetadata} loading={loading} />
        </Box>
      )}
      <Box alignItems="center" marginTop={'4'}>
        <Carousel
          data={captions}
          renderItem={({item, index}) => (
            <Box>
              <Pressable
                maxW="96"
                onPress={() => {
                  Clipboard.setString(item);
                  ToastAndroid.show('copied', ToastAndroid.SHORT);
                }}>
                {({isHovered, isFocused, isPressed}) => {
                  return (
                    <Box
                      bg={
                        isPressed
                          ? 'coolGray.200'
                          : isHovered
                          ? 'coolGray.200'
                          : 'coolGray.100'
                      }
                      style={{
                        transform: [
                          {
                            scale: isPressed ? 0.96 : 1,
                          },
                        ],
                      }}
                      p="5"
                      rounded="8"
                      shadow={3}
                      borderWidth="1"
                      borderColor="green.600">
                      {
                        <Text fontSize={'md'} fontWeight={'semibold'}>
                          {item}
                        </Text>
                      }
                    </Box>
                  );
                }}
              </Pressable>
            </Box>
          )}
          itemWidth={300}
          onSnapToItem={item => console.log(item)}
          pagination
        />
        {captions.length !== 0 && image !== DEFAULT_IMAGE_URL && (
          <Button
            margin={'5'}
            width={'150px'}
            _text={{fontSize: 'md', fontWeight: 'bold', color: 'white'}}
            background={'red.400'}
            _pressed={{backgroundColor: 'red.500'}}
            size={'lg'}
            onPress={() => {
              setCaptions([]);
              setImage(image);
            }}>
            Retry
          </Button>
        )}
      </Box>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  title: {
    margin: '1%',
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
  },
  imageStyle: {
    width: '90%',
    height: '30%',
    resizeMode: 'cover',
  },
});
