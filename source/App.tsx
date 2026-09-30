import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

type Gender = 'MALE' | 'FEMALE';
type Result = {bmi: string; category: string; interpretation: string};

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 220;

export default function App() {
  const [gender, setGender] = useState<Gender | null>(null);
  const [height, setHeight] = useState(180);
  const [weight, setWeight] = useState(60);
  const [age, setAge] = useState(20);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  const updateHeightFromTouch = (touchX: number) => {
    if (sliderWidth < 1) {
      return;
    }
    const ratio = Math.max(0, Math.min(1, touchX / sliderWidth));
    setHeight(Math.round(MIN_HEIGHT + ratio * (MAX_HEIGHT - MIN_HEIGHT)));
  };

  const calculate = () => {
    const bmi = weight / Math.pow(height / 100, 2);
    const category = bmi < 18.5 ? 'UNDERWEIGHT' : bmi < 25 ? 'NORMAL' : 'OVERWEIGHT';
    const interpretation =
      category === 'UNDERWEIGHT'
        ? 'You have a lower than normal body weight. You can eat a bit more.'
        : category === 'NORMAL'
          ? 'You have a normal body weight. Good job!'
          : 'You have a higher than normal body weight. Try to exercise more.';
    setResult({bmi: bmi.toFixed(1), category, interpretation});
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#101326" />
      <View style={styles.header}>
        <Text style={styles.headerEyebrow}>HEALTH TOOLS</Text>
        <Text style={styles.headerTitle}>BMI Calculator</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {result ? (
          <View style={styles.resultWrap}>
            <Text style={styles.sectionLabel}>YOUR RESULT</Text>
            <View style={styles.resultCard}>
              <Text
                style={[
                  styles.resultCategory,
                  result.category === 'NORMAL' && styles.normalText,
                ]}>
                {result.category}
              </Text>
              <Text style={styles.bmiNumber}>{result.bmi}</Text>
              <Text style={styles.resultCaption}>BODY MASS INDEX</Text>
              <View style={styles.divider} />
              <Text style={styles.interpretation}>{result.interpretation}</Text>
              <Text style={styles.resultDetails}>
                {height} cm · {weight} kg · {age} years
                {gender ? ` · ${gender.toLowerCase()}` : ''}
              </Text>
            </View>
            <ActionButton title="RE-CALCULATE" onPress={() => setResult(null)} />
          </View>
        ) : (
          <>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionLabel}>YOUR PROFILE</Text>
              <Text style={styles.sectionHint}>Choose your details to get started</Text>
            </View>

            <View style={styles.row}>
              <GenderCard
                title="MALE"
                symbol="♂"
                selected={gender === 'MALE'}
                onPress={() => setGender('MALE')}
              />
              <GenderCard
                title="FEMALE"
                symbol="♀"
                selected={gender === 'FEMALE'}
                onPress={() => setGender('FEMALE')}
              />
            </View>

            <View style={styles.heightCard}>
              <View style={styles.measureTitleRow}>
                <Text style={styles.cardLabel}>HEIGHT</Text>
                <Text style={styles.rangeLabel}>120 — 220 cm</Text>
              </View>
              <View style={styles.heightReadout}>
                <Text style={styles.heightNumber}>{height}</Text>
                <Text style={styles.unit}>cm</Text>
              </View>
              <View
                accessible
                accessibilityRole="adjustable"
                accessibilityLabel="Height"
                accessibilityValue={{min: MIN_HEIGHT, max: MAX_HEIGHT, now: height}}
                onLayout={event => setSliderWidth(event.nativeEvent.layout.width)}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderGrant={event => updateHeightFromTouch(event.nativeEvent.locationX)}
                onResponderMove={event => updateHeightFromTouch(event.nativeEvent.locationX)}
                style={styles.sliderTouchArea}>
                <View style={styles.sliderTrack}>
                  <View
                    style={[
                      styles.sliderFill,
                      {width: `${((height - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * 100}%`},
                    ]}
                  />
                </View>
                <View
                  style={[
                    styles.sliderThumb,
                    {
                      left: `${((height - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * 100}%`,
                      marginLeft: -12,
                    },
                  ]}
                />
              </View>
              <View style={styles.sliderLabels}>
                <Text style={styles.rangeLabel}>{MIN_HEIGHT} cm</Text>
                <Text style={styles.rangeLabel}>{MAX_HEIGHT} cm</Text>
              </View>
            </View>

            <View style={styles.row}>
              <MeasureCard
                title="WEIGHT"
                value={weight}
                unit="kg"
                onMinus={() => setWeight(value => Math.max(1, value - 1))}
                onPlus={() => setWeight(value => value + 1)}
              />
              <MeasureCard
                title="AGE"
                value={age}
                unit="years"
                onMinus={() => setAge(value => Math.max(1, value - 1))}
                onPlus={() => setAge(value => value + 1)}
              />
            </View>

            <ActionButton title="CALCULATE BMI" onPress={calculate} />
            <Text style={styles.footerNote}>A simple guide to your body mass index</Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function GenderCard({
  title,
  symbol,
  selected,
  onPress,
}: {
  title: Gender;
  symbol: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{selected}}
      onPress={onPress}
      style={[styles.genderCard, selected && styles.selectedCard]}>
      <Text style={[styles.genderSymbol, selected && styles.selectedText]}>{symbol}</Text>
      <Text style={[styles.cardLabel, selected && styles.selectedText]}>{title}</Text>
    </Pressable>
  );
}

function MeasureCard({
  title,
  value,
  unit,
  onMinus,
  onPlus,
}: {
  title: string;
  value: number;
  unit: string;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <View style={styles.measureCard}>
      <Text style={styles.cardLabel}>{title}</Text>
      <View style={styles.measureValueRow}>
        <Text style={styles.measureNumber}>{value}</Text>
        <Text style={styles.smallUnit}>{unit}</Text>
      </View>
      <View style={styles.stepperRow}>
        <StepButton title="−" label={`Decrease ${title.toLowerCase()}`} onPress={onMinus} />
        <StepButton title="+" label={`Increase ${title.toLowerCase()}`} onPress={onPlus} />
      </View>
    </View>
  );
}

function StepButton({title, label, onPress}: {title: string; label: string; onPress: () => void}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({pressed}) => [styles.stepButton, pressed && styles.pressed]}>
      <Text style={styles.stepButtonText}>{title}</Text>
    </Pressable>
  );
}

function ActionButton({title, onPress}: {title: string; onPress: () => void}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [styles.actionButton, pressed && styles.pressed]}>
      <Text style={styles.actionText}>{title}</Text>
      <Text style={styles.actionArrow}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#101326'},
  header: {paddingHorizontal: 22, paddingTop: 8, paddingBottom: 6},
  headerEyebrow: {color: '#9297b5', fontSize: 11, letterSpacing: 2.2, fontWeight: '700'},
  headerTitle: {color: '#f7f7fb', fontSize: 27, fontWeight: '800', marginTop: 3},
  content: {paddingHorizontal: 18, paddingTop: 12, paddingBottom: 24},
  sectionHeading: {marginBottom: 10},
  sectionLabel: {color: '#eef0ff', fontWeight: '800', fontSize: 13, letterSpacing: 1.6},
  sectionHint: {color: '#9095b0', fontSize: 12, marginTop: 3},
  row: {flexDirection: 'row', gap: 12, marginBottom: 12},
  genderCard: {
    flex: 1,
    height: 94,
    borderRadius: 18,
    backgroundColor: '#1a1e36',
    borderWidth: 1,
    borderColor: '#282d49',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  selectedCard: {backgroundColor: '#39243e', borderColor: '#ed6d9b'},
  genderSymbol: {color: '#a7abc3', fontSize: 32, lineHeight: 38},
  selectedText: {color: '#ff8eae'},
  cardLabel: {color: '#a4a8c0', fontSize: 11, fontWeight: '800', letterSpacing: 1.5},
  heightCard: {
    backgroundColor: '#1a1e36',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#282d49',
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 10,
    marginBottom: 12,
  },
  measureTitleRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  rangeLabel: {color: '#858aa6', fontSize: 10},
  heightReadout: {flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginTop: 1},
  heightNumber: {color: '#f8f8fc', fontSize: 47, lineHeight: 55, fontWeight: '800'},
  unit: {color: '#a3a7c0', fontSize: 14, marginLeft: 7},
  sliderTouchArea: {height: 36, justifyContent: 'center', marginHorizontal: 6},
  sliderTrack: {height: 5, borderRadius: 3, backgroundColor: '#363a55', overflow: 'hidden'},
  sliderFill: {height: 5, backgroundColor: '#ff718d', borderRadius: 3},
  sliderThumb: {
    position: 'absolute',
    top: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff718d',
    borderWidth: 3,
    borderColor: '#ffe7ec',
  },
  sliderLabels: {flexDirection: 'row', justifyContent: 'space-between', marginTop: -2},
  measureCard: {
    flex: 1,
    backgroundColor: '#1a1e36',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#282d49',
    paddingHorizontal: 12,
    paddingTop: 13,
    paddingBottom: 11,
    alignItems: 'center',
  },
  measureValueRow: {flexDirection: 'row', alignItems: 'baseline', gap: 5, marginTop: 3, marginBottom: 7},
  measureNumber: {color: '#f8f8fc', fontSize: 34, fontWeight: '800'},
  smallUnit: {color: '#9297b1', fontSize: 11},
  stepperRow: {flexDirection: 'row', gap: 16},
  stepButton: {
    width: 42,
    height: 36,
    borderRadius: 13,
    backgroundColor: '#303550',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: {color: '#f7f7fb', fontSize: 23, fontWeight: '600', lineHeight: 27},
  actionButton: {
    minHeight: 58,
    backgroundColor: '#ff718d',
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    paddingHorizontal: 18,
  },
  actionText: {color: '#191629', fontSize: 15, fontWeight: '900', letterSpacing: 1.2},
  actionArrow: {position: 'absolute', right: 20, color: '#191629', fontSize: 22, fontWeight: '700'},
  pressed: {opacity: 0.78, transform: [{scale: 0.99}]},
  footerNote: {color: '#727894', textAlign: 'center', fontSize: 11, marginTop: 12},
  resultWrap: {flex: 1, justifyContent: 'center', gap: 14, paddingTop: 24},
  resultCard: {
    minHeight: 470,
    backgroundColor: '#1a1e36',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#282d49',
    padding: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCategory: {color: '#ff718d', fontSize: 16, letterSpacing: 2, fontWeight: '900'},
  normalText: {color: '#65dbb3'},
  bmiNumber: {color: '#f8f8fc', fontSize: 84, lineHeight: 96, fontWeight: '800', marginTop: 12},
  resultCaption: {color: '#9297b1', fontSize: 11, letterSpacing: 1.7, fontWeight: '700'},
  divider: {height: 1, backgroundColor: '#343952', width: '100%', marginVertical: 24},
  interpretation: {color: '#e6e7f1', fontSize: 17, lineHeight: 26, textAlign: 'center'},
  resultDetails: {color: '#9297b1', fontSize: 12, marginTop: 26, textAlign: 'center'},
});
