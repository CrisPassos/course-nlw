import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContexts';
import Slider from 'rc-slider';

import Image from 'next/image';

import styles from './styles.module.scss';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';



export default function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const {episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        hasNext,
        hasPrevious,
        isLooping,
        isShuffling,
        clearPlayerState,
        toggleShuffle,
        toggleLoop,
        togglePlay, 
        setPlayingState, 
        playNext, 
        playPrevious} = usePlayer();

    const episode = episodeList[currentEpisodeIndex];

    function setupProgressListener() {
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate',()=>{
            setProgress(Math.floor(audioRef.current.currentTime));
        });

    }

    function handleSeek(amount:number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handledEpisodeEnded() {
        if(hasNext){
            playNext();
        } else {
            clearPlayerState();
        }
    }

    useEffect(() => {
      if(!audioRef.current){
          return;
      } 

      if(isPlaying){
        audioRef.current.play()
      }
      else {
        audioRef.current.pause()
      }
    }, [isPlaying])

    return (
        <div className={styles.playerContainer}>
        <header>
            <img src="/playing.svg" alt="Tocando agora"/>
            <strong>Tocando agora</strong>
        </header>

        {
            episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit="cover"/>
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )
        }
       

        <footer className={!episode? styles.empty: ''}>
            <div className={styles.progress}>
                
                <span>{convertDurationToTimeString(progress)}</span>
                <div className={styles.slider}>
                    {
                        episode ? (
                            <Slider
                                trackStyle={{backgroundColor: '#84d365'}}
                                railStyle={{backgroundColor: '#9f75ff'}}
                                handleStyle={{borderColor: '#84d365', borderWidth: 4}}
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                            />
                        ) : (
                            <div className={styles.emptySlider}></div>
                        )
                    }
                </div>
                <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
            </div>

            {episode && (
                <audio src={episode.url} autoPlay ref={audioRef} 
                onEnded={handledEpisodeEnded}
                loop={isLooping}
                onPlay={()=>{setPlayingState(true)}} onPause={()=>{setPlayingState(false)}}
                onLoadedMetadata={setupProgressListener}/>
            )}
            <div className={styles.buttons}>
                <button type="button" disabled={!episode || episodeList.length === 1} 
                onClick={toggleShuffle} className={isShuffling ? styles.isActive: ''} >
                    <img src="/shuffle.svg" alt="embaralhar" />
                </button>
                <button type="button" disabled={!episode || !hasPrevious}  onClick={playPrevious}>
                    <img src="/play-previous.svg" alt="Tocar anterior"/>
                </button>
                <button 
                    type="button" 
                    className={styles.playButton}  
                    disabled={!episode}
                    onClick={togglePlay}
                    >
                    {
                        isPlaying ? <img src="/pause.svg" alt="Pause"/> :
                                    <img src="/play.svg" alt="Tocar"/>
                    }
                    
                </button>
                <button type="button" disabled={!episode || !hasNext}>
                    <img src="/play-next.svg" alt="Tocar próxima" onClick={playNext}/>
                </button>
                <button type="button" disabled={!episode} className={isLooping ? styles.isActive: ''} onClick={toggleLoop}>
                    <img src="/repeat.svg" alt="Repetis"/>
                </button>
            </div>

        </footer>

        </div>
    );
}

