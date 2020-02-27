import Base from "../../engine/Base.js";

export default class ScoreCalculator extends Base.Behavior{
    calculateScore(data, beatTime, phaseTime) {
        let closestHitDelta = phaseTime;
        let lastBeat = 0;
        let misses = 0;
        let score = phaseTime;

        data.forEach(tap => {
            let currentBeat = tap.beat;

            //New beat
            if(currentBeat != lastBeat) {
                //New beat hit
                if(lastBeat + beatTime == currentBeat) {
                    console.log("New beat hit");
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

        let missPenalty = misses * beatTime;
        console.log("Miss Penalty: " + missPenalty + ", with " + misses + " misses");
        score -= missPenalty;
        score /= phaseTime;

        if(score < 0) {
            score = 0;
        }

        return score;
    }
}