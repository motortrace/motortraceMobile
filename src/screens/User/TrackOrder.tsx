import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';

const TrackOrderScreen = ({ navigation }) => { // Add navigation prop
  const progressSteps = [
    {
      id: 1,
      title: 'Inspection',
      subtitle: '21st Sept, 2021 | 15:02',
      status: 'completed',
      hasDetails: true, // Add this flag to indicate clickable steps
    },
    {
      id: 2,
      title: 'New parts requests',
      subtitle: '21st Sept, 2021 | 18:02',
      status: 'completed',
      hasDetails: true,
    },
    {
      id: 3,
      title: 'Installation',
      subtitle: '22st Sept, 2021 | 09:02',
      status: 'completed',
    },
    {
      id: 4,
      title: 'Final Inspection',
      subtitle: '',
      status: 'pending',
    },
    {
      id: 5,
      title: 'Ready for Payment',
      subtitle: '',
      status: 'pending',
      hasDetails: true,
    },
    {
      id: 6,
      title: 'Ready for Pickup',
      subtitle: '',
      status: 'pending',
    },
  ];

  const handleStepPress = (step) => {
    if (step.hasDetails && step.status === 'completed') {
      // Navigate to inspection results screen
      navigation.navigate('InspectionResults', { 
        bookingId: '123456789',
        stepData: step 
      });
    }
  };

  const renderProgressStep = (step, index) => {
    const isLast = index === progressSteps.length - 1;
    const isClickable = step.hasDetails && step.status === 'completed';
    
    const StepWrapper = isClickable ? TouchableOpacity : View;
    
    return (
      <StepWrapper 
        key={step.id} 
        style={styles.progressStepContainer}
        onPress={() => handleStepPress(step)}
        activeOpacity={isClickable ? 0.7 : 1}
      >
        <View style={styles.progressStepLeft}>
          <View
            style={[
              styles.progressCircle,
              step.status === 'completed' && styles.progressCircleCompleted,
              step.status === 'active' && styles.progressCircleActive,
            ]}
          >
            {step.status === 'completed' && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          {!isLast && (
            <View
              style={[
                styles.progressLine,
                (step.status === 'completed' || step.status === 'active') && 
                styles.progressLineActive,
              ]}
            />
          )}
        </View>
        <View style={styles.progressStepRight}>
          <View style={styles.stepTitleContainer}>
            <Text
              style={[
                styles.progressStepTitle,
                step.status === 'active' && styles.progressStepTitleActive,
                isClickable && styles.progressStepTitleClickable,
              ]}
            >
              {step.title}
            </Text>
            {isClickable && (
              <View style={styles.viewDetailsContainer}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Icon name="arrow-forward" size={24} style={styles.arrowIcon} />
              </View>
            )}
          </View>
          {step.subtitle && (
            <Text style={styles.progressStepSubtitle}>{step.subtitle}</Text>
          )}
        </View>
      </StepWrapper>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

      <Header 
        icon="back"
        name="Jhon"
        image=""
      />

        {/* Service Details Card */}
        <View style={styles.serviceCard}>
          <Text style={styles.serviceTitle}>Basic Service</Text>
          <Text style={styles.bookingId}>Booking ID: 123456789</Text>
          
          <View style={styles.providerSection}>
            <Text style={styles.providerName}>General Motors</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text key={star} style={styles.star}>★</Text>
              ))}
            </View>
          </View>

          <View style={styles.carImageContainer}>
            <Image
            source={require('../../assets/images/car.png')} 
              style={styles.carImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.timeInfoContainer}>
            <View style={styles.timeInfoLeft}>
              <Text style={styles.timeLabel}>DATE</Text>
              <Text style={styles.timeValue}>21st Sept 2021, Monday</Text>
            </View>
            <View style={styles.timeInfoRight}>
              <Text style={styles.timeLabel}>PICK-UP TIME</Text>
              <Text style={styles.timeValue}>9:00-9:30am</Text>
            </View>
          </View>

          <Text style={styles.estimatedCompletion}>
            Estimated Completion: <Text style={styles.completionTime}>Tomorrow, 12:30pm</Text>
          </Text>
        </View>

        {/* Progress Tracking */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Service Progress</Text>
          {progressSteps.map((step, index) => renderProgressStep(step, index))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral0,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.neutral0,
  },
  backButton: {
    marginRight: 16,
  },
  backArrow: {
    fontSize: 24,
    color: Colors.neutral700,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
  },
  serviceCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.shadowMd,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 14,
    color: Colors.neutral600,
    marginBottom: 16,
  },
  providerSection: {
    marginBottom: 16,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    color: Colors.Star,
    fontSize: 16,
    marginRight: 2,
  },
  carImageContainer: {
    alignItems: 'center',
    marginVertical: 16,
    marginTop: -170,
    marginRight: -200,
  },
  carImage: {
    width: 400,
    height: 240,
  },
  timeInfoContainer: {
    marginTop: -20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeInfoLeft: {
    flex: 1,
  },
  timeInfoRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral600,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  timeValue: {
    fontSize: 14,
    color: Colors.neutral900,
    fontWeight: '500',
  },
  estimatedCompletion: {
    fontSize: 14,
    color: Colors.neutral600,
  },
  completionTime: {
    color: Colors.neutral900,
    fontWeight: '500',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral900,
    marginBottom: 16,
  },
  progressStepContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  progressStepLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  progressCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.neutral300,
    backgroundColor: Colors.neutral0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircleCompleted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  progressCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.neutral0,
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressLine: {
    width: 2,
    height: 40,
    backgroundColor: Colors.neutral300,
    marginTop: 4,
  },
  progressLineActive: {
    backgroundColor: Colors.primary,
  },
  progressStepRight: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStepTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral700,
    marginBottom: 2,
  },
  progressStepTitleActive: {
    color: Colors.neutral900,
    fontWeight: '600',
  },
  progressStepTitleClickable: {
    color: Colors.primary,
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  arrowIcon: {
    fontSize: 14,
    color: Colors.primary,
  },
  progressStepSubtitle: {
    fontSize: 14,
    color: Colors.neutral500,
  },
});

export default TrackOrderScreen;