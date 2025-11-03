import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { YouTubePlayerModule, YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [YouTubePlayerModule],
  templateUrl: './media.html',
  styleUrl: './media.css'
})
export class MediaComponent implements OnInit, OnDestroy {
  @Input() youtubeId: string = '';
  @ViewChild('youtubePlayer') youtubePlayer!: YouTubePlayer;
  
  private apiLoaded = false;
  currentVolume: number = 100;
  currentTime: number = 0;
  duration: number = 0;
  private updateInterval: number | undefined;
  public isPlaying = false;

  playerVars = {
    controls: 0,
    autoplay: 0,
    modestbranding: 1,
    playsinline: 1,
    rel: 0,
    showinfo: 0,
    fs: 1,
    cc_load_policy: 1
  };

  ngOnInit() {
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  ngOnDestroy() {
    this.stopTimeUpdate();
  }

  //Añadido para tapar el overlay de Youtube

  overlayHidden: boolean = false;

  onPlayerStateChange(event: any) {
    const state = event.data;
    if (state === 1) {
      this.overlayHidden = true; // oculta el overlay cuando reproduce
      this.isPlaying = true;
      this.startTimeUpdate();
    } else if (state === 2 || state === 0 || state === -1) {
      this.overlayHidden = false; // muestra overlay al pausar o terminar
      this.isPlaying = false;
      this.stopTimeUpdate();
    }
  }

  //Añadido que usa nuestro boton play en caso de que se haga click en el overlay de Youtube
  onOverlayClick() {
    this.playVideo(); 
  }

  //Fin del añadido

  private startTimeUpdate() {
    if (!this.updateInterval) {
      this.updateInterval = window.setInterval(() => {
        if (this.youtubePlayer) {
          const currentTime = this.youtubePlayer.getCurrentTime();
          const duration = this.youtubePlayer.getDuration();
          
          if (typeof currentTime === 'number') {
            this.currentTime = currentTime;
          }
          
          if (typeof duration === 'number') {
            this.duration = duration;
          }
        }
      }, 1000);
    }
  }

  private stopTimeUpdate() {
    if (this.updateInterval) {
      window.clearInterval(this.updateInterval);
      this.updateInterval = undefined;
    }
  }

  playVideo() {
    if (!this.isPlaying) {
      this.youtubePlayer?.playVideo();
      this.startTimeUpdate();
      this.isPlaying = true;
    }
  }

  pauseVideo() {
    this.youtubePlayer?.pauseVideo();
    this.isPlaying = false;
  }

  stopVideo() {
    this.youtubePlayer?.stopVideo();
    this.isPlaying = false;
    this.stopTimeUpdate();
    this.currentTime = 0;
  }

  onVolumeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const volume = parseInt(input.value, 10);
    this.setVolume(volume);
  }

  setVolume(volume: number) {
    if (volume >= 0 && volume <= 100) {
      this.currentVolume = volume;
      this.youtubePlayer?.setVolume(volume);
    }
  }

  onProgressChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const time = parseFloat(input.value);
    this.seekTo(time);
  }

  seekTo(seconds: number) {
    if (seconds >= 0 && seconds <= this.duration) {
      this.youtubePlayer?.seekTo(seconds, true);
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}