import React, {useState} from 'react';
import {Button, Center, Container, Flex, Input} from 'native-base';
import SelectBox from 'react-native-multi-selectbox';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MOOD_OPTIONS = [
  {
    item: 'Fun',
    id: 'fun',
  },
  {
    item: 'Light Hearted',
    id: 'lighthearted',
  },
  {
    item: 'Funny',
    id: 'funny',
  },
  {
    item: 'Silly',
    id: 'silly',
  },
  {
    item: 'Influencer',
    id: 'influencer',
  },
  {
    item: 'Flirty',
    id: 'flirty',
  },
  {
    item: 'Serious',
    id: 'serious',
  },
  {
    item: 'Professional',
    id: 'professional',
  },
  {
    item: 'Persuasive',
    id: 'persuasive',
  },
  {
    item: 'Braggadocious',
    id: 'braggadocious',
  },
  {
    item: 'Hippy',
    id: 'hippy',
  },
  {
    item: 'Stoic',
    id: 'stoic',
  },

  {
    item: 'Sales Pitch',
    id: 'sales pitch',
  },
  {
    item: 'Poetic',
    id: 'poetic',
  },
  {
    item: 'Punny',
    id: 'punny',
  },
  {
    item: 'Hip-Hop',
    id: 'Hip-hop',
  },
  {
    item: 'Sarcastic',
    id: 'sarcastic',
  },
  {
    item: 'Romantic',
    id: 'romantic',
  },
];

const LENGTH_OPTIONS = [
  {
    item: 'Short',
    id: 'short length',
  },
  {
    item: 'Medium',
    id: 'medium length',
  },
  {
    item: 'Long',
    id: 'long length',
  },
];

interface Props {
  setData: (value: Object) => void;
  loading: boolean;
}

const UserForm = ({setData, loading}: Props) => {
  const [selectedMoods, setSelectedMoods] = useState([
    {
      item: 'Fun',
      id: 'fun',
    },
  ]);
  const [selectedLength, setSelectedLength] = useState({
    item: 'Short',
    id: 'short length',
  });
  const [additionalInfo, setAdditionalInfo] = useState('');
  return (
    <Container>
      <Center>
        <Flex direction="row" justifyContent={'space-between'}>
          <SelectBox
            width={'70%'}
            label="Select Mood"
            labelStyle={{fontSize: 15, paddingBottom: 10, fontWeight: 'bold'}}
            selectedItemStyle={{backgroundColor: 'green'}}
            multiOptionContainerStyle={{backgroundColor: 'green'}}
            multiOptionsLabelStyle={{backgroundColor: 'green'}}
            toggleIconColor="green"
            arrowIconColor="green"
            searchIconColor="green"
            options={MOOD_OPTIONS}
            selectedValues={selectedMoods}
            onMultiSelect={(value: any) => {
              setSelectedMoods([...selectedMoods, value]);
            }}
            onChange={(value: any) => {
              console.log(value);
            }}
            onTapClose={(value: any) => {
              const selectedList = selectedMoods.filter(
                (each: any) => each.id !== value.id,
              );
              setSelectedMoods(selectedList);
            }}
            isMulti
          />
          <SelectBox
            width={'35%'}
            label="Select Length"
            labelStyle={{fontSize: 15, paddingBottom: 10, fontWeight: 'bold'}}
            multiOptionContainerStyle={{backgroundColor: 'green'}}
            multiOptionsLabelStyle={{backgroundColor: 'green'}}
            toggleIconColor="green"
            arrowIconColor="green"
            searchIconColor="green"
            options={LENGTH_OPTIONS}
            value={selectedLength}
            onChange={(value: any) => {
              setSelectedLength(value);
            }}
          />
        </Flex>
        <Input
          size="xl"
          placeholder="Add some additional info"
          marginTop={'4'}
          value={additionalInfo}
          onChangeText={value => {
            setAdditionalInfo(value);
          }}
        />
        <Button
          isLoading={loading}
          width={'200'}
          margin={'5'}
          _text={{
            fontSize: 'lg',
            fontWeight: '500',
            color: 'white',
          }}
          rightIcon={<Icon name="cloud-sync" size={25} color={'white'}></Icon>}
          background={'#141E46'}
          _pressed={{backgroundColor: '#253883'}}
          size={'lg'}
          onPress={() => {
            setData({
              mood: selectedMoods.map((each: any) => each.id),
              length: selectedLength?.id,
              additionalInfo: additionalInfo,
            });
          }}>
          Get Captions
        </Button>
      </Center>
    </Container>
  );
};

export default UserForm;
