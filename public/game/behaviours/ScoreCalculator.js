import Base from "../../engine/Base.js";

export default class ScoreCalculator extends Base.Behavior{
    calculateScore(data, beatTime, phaseTime, cycles) {
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
                    console.log("Missed a beat at " + lastBeat);
                    let numMisses = (currentBeat - beatTime) - lastBeat;
                    numMisses = numMisses / beatTime;
                    //console.log("Number of misses: " + numMisses);
                    misses += numMisses;
                    
                    closestHitDelta = Math.abs(tap.delta);
                    lastBeat = currentBeat;
                }
            } 
            //Tap on the same beat
            else {
                console.log("Hit the same beat");
                //Current tap is closer
                if(closestHitDelta > Math.abs(tap.delta)){
                    closestHitDelta = Math.abs(tap.delta);
                }
                misses++;
            }
        });

        //Check if missed the last beat
        if(lastBeat != (phaseTime*2)) {
            console.log("Missed the last beat");
            //Calculate the number of misses from the last beat
            let numMisses = (phaseTime*2) - lastBeat;
            numMisses = numMisses / beatTime;
            misses += numMisses;
        } else {
            score -= closestHitDelta;
        }

        let missPenalty = misses * beatTime;
        console.log("Miss Penalty: " + missPenalty + ", with " + misses + " misses");
        score -= missPenalty;
        score /= (phaseTime * cycles);

        if(score < 0) {
            score = 0;
        }

        return score;
    }
}