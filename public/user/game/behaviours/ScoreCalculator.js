//File: /user/game/behaviours/ScoreCalculator.js

//Description: Calculates the player's score at the end of the game

import Base from "../../engine/Base.js";

export default class ScoreCalculator extends Base.Behavior{
    /*
		oldCalculateScore
		params: data - The array of scored taps; beatTime - The length of a single beat, phaseTime - The length of a phase; cycles - the number of cycles
		returns: score - The player's score for the session
		Calculates the player's score at the end of the session (Old version, no longer used)
	*/
    oldCalculateScore(data, beatTime, phaseTime, cycles) {
        let closestHitDelta = 0;
        let lastBeat = phaseTime;
        let misses = 0;
        let score = phaseTime;

        data.forEach(tap => {
            let currentBeat = tap.beat;
            //New beat
            if(currentBeat != lastBeat) {
                //New beat hit
                if(lastBeat + beatTime == currentBeat) {
                    //Factor the last beat hit into the score
                    score -= closestHitDelta;
                    closestHitDelta = Math.abs(tap.delta);
                    lastBeat = currentBeat
                } 
                //Missed a beat
                else {
                    let numMisses = (currentBeat - beatTime) - lastBeat;
                    numMisses = numMisses / beatTime;

                    misses += numMisses;
                    closestHitDelta = Math.abs(tap.delta);
                    lastBeat = currentBeat;
                }
            } 
            //Tap on the same beat
            else {
                //Current tap is closer
                if(closestHitDelta > Math.abs(tap.delta)){
                    closestHitDelta = Math.abs(tap.delta);
                }
                misses++;
            }
        });

        //Check if missed the last beat
        if(lastBeat != (phaseTime*2)) {
            //Calculate the number of misses from the last beat
            let numMisses = (phaseTime*2) - lastBeat;
            numMisses = numMisses / beatTime;
            misses += numMisses;
        } else {
            score -= closestHitDelta;
        }

        let missPenalty = misses * beatTime;
        score -= missPenalty;
        score /= ((phaseTime * cycles) + (0.5 * beatTime));

        if(score < 0) {
            score = 0;
        }

        return score;
    }

    /*
		newCalculateScore
		params: data - The array of scored taps; beatTime - The length of a single beat
		returns: score - The player's score for the session
		Calculates the player's score at the end of the session
	*/
    newCalculateScore(data, beatTime) {
        let total = 0;

        data.forEach(tap => {
            let error = 100*(tap.timeSinceLast - beatTime)/beatTime;
            error = Math.abs(error);
            total += (105 - (error * 5));
        });

        let score = total/data.length;
        
        if(score < 0) {
            score = 0;
        } else if(score > 100) {
            score = 100;
        }

        return score;
    }
}