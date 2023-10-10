import axios from 'axios';
import React, { useCallback, useMemo } from 'react';
import { AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai';

import useCurrentUser from '@/hooks/useCurrentUser';
import useFavorites from '@/hooks/useFavorites';

interface FavoritesButtonProps { 
  movieId: string;
}

const FavoriteButton: React.FC<FavoritesButtonProps> = ({ movieId }) => { 
  const { mutate: mutateFavorites } = useFavorites();
  const { data: currentUser, mutate } = useCurrentUser();

  const isFavorite = useMemo(() => {
    const list = currentUser?.favorites || [];
    
    return list.includes(movieId);
  }, [currentUser, movieId]);

  const toggleFavorite = useCallback(async () => {
    let response;
    
    if (isFavorite) {
      response = await axios.delete('/api/favorite', { data: { movieId }})
  
    } else {
      response = await axios.post('/api/favorite', { movieId })
    }

    const updatedFavorites = response?.data?.favorites;
    
    mutate ({
      ...currentUser,
      favorites: updatedFavorites
    });


    mutateFavorites();
    
    
  }, [movieId, isFavorite, currentUser, mutate, mutateFavorites]);

  const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;

  return (
    <div 
      onClick = { toggleFavorite }
      className="
        cursor-pointer
        group/item
        w-6
        h-6
        lg:w-10
        lg:h-10
        border-white
        border-2
        rounded-full
        flex
        justify-center
        transition
        hover:border-neutral-300
      "
    >

      <Icon size={20} className="text-white" />

    </div>
  )
}

export default FavoriteButton;