import React, { useRef, useState } from 'react';
import AddTaskForm from 'components/AddTaskForm';
import { View, PanResponder, Animated, Text, StyleSheet } from 'react-native';
interface CardData {
  id: string;
  heading: string;
  paragraph: string;
}
interface CardData {
  id: string;
  heading: string;
  paragraph: string;
}

const initialCards: CardData[] = [
  {
    id: '1',
    heading: '1st text',
    paragraph: 'random text',
  },
  {
    id: '2',
    heading: '2nd text',
    paragraph: 'this text should be swapped',
  },
  {
    id: '3',
    heading: '3rd text',
    paragraph: 'this text should be swapped',
  },
];

const DragAndDropCard: React.FC<{
  heading: string;
  paragraph: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}> = ({ heading, paragraph, index, moveCard }) => {
  const position = useRef(new Animated.ValueXY()).current;
  const [dragging, setDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setDragging(true);
      },
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: position.x,
            dy: position.y,
          },
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (event, gesture) => {
        const hoverIndex = index;
        moveCard(index, hoverIndex);
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start(() => setDragging(false));
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: position.getTranslateTransform(),
          opacity: dragging ? 0.8 : 1,
        },
      ]}
      {...panResponder.panHandlers}>
      <Text style={styles.cardHeading}>{heading}</Text>
      <Text style={styles.cardParagraph}>{paragraph}</Text>
    </Animated.View>
  );
};

const Page: React.FC = () => {
  const [cards, setCards] = useState(initialCards);
  const [isActive, setIsActive] = useState(false);

  const addCard = (task: string, task2: string = '') => {
    const newCard = {
      id: String(cards.length + 1),
      heading: task,
      paragraph: task2 || 'Optional text',
    };
    setCards([...cards, newCard]);
  };

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const dragCard = cards[dragIndex];
    const newCards = [...cards];
    newCards.splice(dragIndex, 1);
    newCards.splice(hoverIndex, 0, dragCard);
    setCards(newCards);
  };

  return (
    <View style={styles.content}>
       <View>
        <Text style={styles.title}>Drag and drop app</Text>
        <Text style={styles.subtitle}>try moving the elements</Text>
      </View>
      <AddTaskForm
        onPressIn={() => setIsActive(true)}
        onPressOut={() => setIsActive(false)}
        isActive={isActive}
        onAddTask={addCard}
      />
      <View style={styles.cardsWrapper}>
        {cards.map((card, index) => (
          <DragAndDropCard
            key={card.id}
            heading={card.heading}
            paragraph={card.paragraph}
            index={index}
            moveCard={moveCard}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    marginTop: 20,
    borderWidth: 1,
    width: 300,
    borderColor: 'grey',
    margin: 'auto',
    padding: 10,
  },
  cardsWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
  },
  subtitle: {
    fontWeight: '100',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 18,
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: '400',
  },
  cardParagraph: {
    fontWeight: '100',
    fontSize: 14,
    color: 'gray',
  },
});

export default Page;
