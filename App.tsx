
import React, { useState, useCallback } from 'react';
import { Screen, Experience, Trip, User } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { mockExperiences, mockUser } from './data/mockData';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import ExploreScreen from './screens/ExploreScreen';
import ExperienceDetailScreen from './screens/ExperienceDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import TripsScreen from './screens/TripsScreen';
import BookingScreen from './screens/BookingScreen';
import ReservationScreen from './screens/ReservationScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';
import BottomNav from './components/BottomNav';


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>('moveasy_isLoggedIn', false);
  const [isGuest, setIsGuest] = useState<boolean>(!isLoggedIn);
  const [activeScreen, setActiveScreen] = useState<Screen>(isLoggedIn ? Screen.Explore : Screen.Welcome);
  
  const [favorites, setFavorites] = useLocalStorage<string[]>('moveasy_favorites', []);
  const [trips, setTrips] = useLocalStorage<Trip[]>('moveasy_trips', []);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  const user: User | null = isLoggedIn ? mockUser : null;

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  }, [setFavorites]);
  
  const addTrip = useCallback((tripData: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      ...tripData
    };
    setTrips(prev => [newTrip, ...prev]);
  }, [setTrips]);

  const handleSetIsLoggedIn = (status: boolean) => {
      setIsLoggedIn(status);
      if(status) {
        setIsGuest(false);
      }
  }
  
  const setTripsScreen = () => setActiveScreen(Screen.Trips);

  const renderScreen = () => {
    switch (activeScreen) {
      case Screen.Welcome:
        return <WelcomeScreen setActiveScreen={setActiveScreen} setIsGuest={setIsGuest} />;
      case Screen.Login:
        return <LoginScreen setActiveScreen={setActiveScreen} setIsLoggedIn={handleSetIsLoggedIn} />;
      case Screen.Explore:
        return <ExploreScreen user={user} favorites={favorites} toggleFavorite={toggleFavorite} setSelectedExperience={setSelectedExperience} setActiveScreen={setActiveScreen} />;
      case Screen.ExperienceDetail:
        if (selectedExperience) {
          return <ExperienceDetailScreen experience={selectedExperience} isFavorite={favorites.includes(selectedExperience.id)} toggleFavorite={toggleFavorite} setActiveScreen={setActiveScreen} />;
        }
        setActiveScreen(Screen.Explore);
        return null;
      case Screen.Favorites:
        return <FavoritesScreen favorites={favorites} allExperiences={mockExperiences} toggleFavorite={toggleFavorite} setSelectedExperience={setSelectedExperience} setActiveScreen={setActiveScreen} />;
      case Screen.Trips:
        return <TripsScreen trips={trips} />;
      case Screen.Booking:
        return <BookingScreen setActiveScreen={setActiveScreen} addTrip={addTrip}/>;
      case Screen.Reservation:
        if (selectedExperience) {
          return <ReservationScreen experience={selectedExperience} setActiveScreen={setActiveScreen} addTrip={addTrip} />;
        }
        setActiveScreen(Screen.Explore);
        return null;
      case Screen.Profile:
        return <ProfileScreen user={user} setIsLoggedIn={handleSetIsLoggedIn} setActiveScreen={setActiveScreen} setTripsScreen={setTripsScreen} />;
      case Screen.Chat:
        return <ChatScreen setActiveScreen={setActiveScreen} />;
      default:
        return <WelcomeScreen setActiveScreen={setActiveScreen} setIsGuest={setIsGuest} />;
    }
  };

  const showBottomNav = ![
    Screen.Welcome, 
    Screen.Login, 
    Screen.ExperienceDetail, 
    Screen.Booking, 
    Screen.Reservation,
    Screen.Chat
  ].includes(activeScreen);


  return (
    <div className="max-w-sm mx-auto h-screen bg-zinc-50 border border-gray-200/80 shadow-lg flex flex-col overflow-hidden relative">
      <main className="flex-grow overflow-y-auto">
        {renderScreen()}
      </main>
      {showBottomNav && (
        <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      )}
    </div>
  );
};

export default App;
