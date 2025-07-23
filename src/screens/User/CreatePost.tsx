const renderCategoryOption = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryOption,
        selectedCategory === category.id && { 
          borderColor: category.color,
          backgroundColor: `${category.color}10`
        }
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Icon 
        name={category.icon} 
        size={20} 
        color={selectedCategory === category.id ? category.color : Colors.neutral600} 
      />
      <Text style={[
        styles.categoryOptionText,
        selectedCategory === category.id && { color: category.color }
      ]}>
        {category.name}
      </Text>
      {selectedCategory === category.id && (
        <Icon name="checkmark-circle" size={20} color={category.color} />
      )}
    </TouchableOpacity>
  );
  
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';
import BottomNavigation from '../../components/BottomNav';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState(2);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const navItems = [
  {
    id: "home",
    icon: "home-outline",
    label: "Home",
    onPress: () => navigation.navigate('Forum'),
  },
  { 
    id: "search",
    icon: "search-outline",
    label: "Discover",
    onPress: () => navigation.navigate('SearchPosts'),
  },
  {
    id: "create",
    icon: "add-circle-outline",
    label: "Create",
    onPress: () => navigation.navigate('CreatePost'),
  },
  {
    id: "notifications",
    icon: "notifications-outline",
    label: "Alerts",
    onPress: () => navigation.navigate('NotificationForum'),
  },
  {
    id: "profile",
    icon: "person-outline",
    label: "Profile",
    onPress: () => navigation.navigate('ForumProfile'),
  },
]

  const addCategory = () => {
    if (currentCategory.trim() && categories.length < 10 && !categories.includes(currentCategory.trim())) {
      setCategories([...categories, currentCategory.trim()]);
      setCurrentCategory('');
    }
  };

  const removeCategory = (categoryToRemove) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
  };

  const handleCategorySubmit = () => {
    addCategory();
  };

  const handleImagePicker = () => {
    // Placeholder for image picker functionality
    Alert.alert(
      'Add Images',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handlePublish = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your post');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }
    if (!categories.length) {
      Alert.alert('Error', 'Please add at least one category for your post');
      return;
    }

    // Placeholder for post creation logic
    Alert.alert('Success', 'Your post has been published!', [
      { text: 'OK', onPress: () => console.log('Post published') }
    ]);
  };

  const handleSaveDraft = () => {
    Alert.alert('Draft Saved', 'Your post has been saved as a draft');
  };

  const renderCategoryOption = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryOption,
        selectedCategory === category.id && { 
          borderColor: category.color,
          backgroundColor: `${category.color}10`
        }
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Icon 
        name={category.icon} 
        size={20} 
        color={selectedCategory === category.id ? category.color : Colors.neutral600} 
      />
      <Text style={[
        styles.categoryOptionText,
        selectedCategory === category.id && { color: category.color }
      ]}>
        {category.name}
      </Text>
      {selectedCategory === category.id && (
        <Icon name="checkmark-circle" size={20} color={category.color} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="back"
        name="Create Post"
        image=""
        onIconPress={() => navigation.navigate('Home')}
        rightComponent={
          <TouchableOpacity onPress={handleSaveDraft}>
            <Text style={styles.draftButton}>Save Draft</Text>
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Input */}
          <View style={[styles.section, {marginTop: 22}]}>
            <Text style={styles.sectionLabel}>Title</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="What's your post about?"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              placeholderTextColor={Colors.neutral500}
            />
            <Text style={styles.characterCount}>{title.length}/100</Text>
          </View>

          {/* Categories Input */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Categories *</Text>
            <Text style={styles.sectionDescription}>Add relevant categories (max 10)</Text>
            
            <View style={styles.categoryInputContainer}>
              <TextInput
                style={styles.categoryInput}
                placeholder="Add a category..."
                value={currentCategory}
                onChangeText={setCurrentCategory}
                onSubmitEditing={handleCategorySubmit}
                placeholderTextColor={Colors.neutral500}
                returnKeyType="done"
              />
              <TouchableOpacity 
                style={[
                  styles.addCategoryButton,
                  (!currentCategory.trim() || categories.length >= 10) && styles.addCategoryButtonDisabled
                ]}
                onPress={addCategory}
                disabled={!currentCategory.trim() || categories.length >= 10}
              >
                <Icon name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {categories.length > 0 && (
              <View style={styles.categoriesDisplay}>
                {categories.map((category, index) => (
                  <View key={index} style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>#{category}</Text>
                    <TouchableOpacity 
                      style={styles.removeCategoryButton}
                      onPress={() => removeCategory(category)}
                    >
                      <Icon name="close" size={14} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            
            <Text style={styles.categoryCount}>{categories.length}/10 categories</Text>
          </View>

          {/* Content Input */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Content *</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Share your thoughts, ask questions, or start a discussion..."
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              maxLength={2000}
              placeholderTextColor={Colors.neutral500}
            />
            <Text style={styles.characterCount}>{content.length}/2000</Text>
          </View>

          {/* Tags Input */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tags</Text>
            <Text style={styles.sectionDescription}>Add relevant tags separated by commas</Text>
            <TextInput
              style={styles.tagsInput}
              placeholder="e.g. react-native, ui-design, javascript"
              value={tags}
              onChangeText={setTags}
              placeholderTextColor={Colors.neutral500}
            />
          </View>

          {/* Image Upload */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Images</Text>
            <Text style={styles.sectionDescription}>Add up to 4 images to your post</Text>
            
            <TouchableOpacity style={styles.imageUploadButton} onPress={handleImagePicker}>
              <Icon name="image-outline" size={24} color={Colors.primary} />
              <Text style={styles.imageUploadText}>Add Images</Text>
            </TouchableOpacity>

            {images.length > 0 && (
              <View style={styles.imagePreviewContainer}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imagePreview}>
                    <Image source={{ uri: image }} style={styles.previewImage} />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Icon name="close-circle" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Post Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Post Settings</Text>

            <TouchableOpacity 
              style={styles.settingOption}
              onPress={() => setAllowComments(!allowComments)}
            >
              <View style={styles.settingInfo}>
                <Icon name="chatbubbles-outline" size={20} color={Colors.neutral600} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Allow Comments</Text>
                  <Text style={styles.settingDescription}>Others can comment on your post</Text>
                </View>
              </View>
              <View style={[styles.toggle, allowComments && styles.toggleActive]}>
                <View style={[styles.toggleThumb, allowComments && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.scheduleContainer}>
        <Button label="Publish" onPress={() => {}} />
      </View>
      <BottomNavigation
        navItems={navItems}
        activeTab={activeTab}
        onTabPress={() => {}}
      />  
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral0,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  draftButton: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral800,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 12,
    color: Colors.neutral600,
    marginBottom: 12,
  },
  titleInput: {
    fontSize: 16,
    color: Colors.neutral800,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.neutral100,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.neutral300,
  },
  contentInput: {
    fontSize: 16,
    color: Colors.neutral800,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.neutral100,
    borderRadius: 12,
    height: 120,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.neutral300,
  },
  tagsInput: {
    fontSize: 16,
    color: Colors.neutral800,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.neutral100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral300,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.neutral500,
    textAlign: 'right',
    marginTop: 4,
  },
  categoryInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral800,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.neutral100,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.neutral300,
  },
  addCategoryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addCategoryButtonDisabled: {
    backgroundColor: Colors.neutral400,
    shadowOpacity: 0,
    elevation: 0,
  },
  categoriesDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  categoryTagText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginRight: 6,
  },
  removeCategoryButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: Colors.neutral600,
    textAlign: 'right',
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    backgroundColor: `${Colors.primary}10`,
  },
  imageUploadText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  imagePreview: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
  },
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral800,
  },
  settingDescription: {
    fontSize: 12,
    color: Colors.neutral600,
    marginTop: 2,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.neutral300,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: Colors.primary,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  publishContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  publishButtonDisabled: {
    backgroundColor: Colors.neutral400,
    elevation: 0,
    shadowOpacity: 0,
  },
  publishIcon: {
    marginRight: 8,
  },
  publishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
  scheduleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
  },
});

export default CreatePost;