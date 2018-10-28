import React from 'react';
import Icon from './Icon';
import { Link } from "react-router-dom";

export default ({hash, tokenId, isPlaying, isMutating, isPicked, startMutate, finishMutate, cancelMutate, togglePlay}) => (
  <div className="token-preview">
    <Icon hash={hash} />
    { isMutating ?
      <div className="controls mutate-mode">
        { isPicked ?
          <div className="action mutate" onClick={cancelMutate}>
            <div className="close-icon"></div>
          </div>
        : <div className="action mutate" onClick={finishMutate}>
            <div className="dna-icon"></div>
          </div>
        }
      </div>
    : <div className="controls on-hover">
        <div className="action play" onClick={togglePlay}>
          {isPlaying ?
            <div className="pause-icon"></div>
          : <div className="play-icon"></div> 
          }
        </div>
        <div className="action mutate" onClick={startMutate}>
          <div className="dna-icon"></div>
        </div>
      </div> }
  </div>
)