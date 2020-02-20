class ScoreCalculator{
    calculateScore(data, beatTime, totalTime) {
        let closestHitDelta = 0;
        let lastBeat = 0;
        let misses = 0;
        let score = totalTime;

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
                    //Calculate number of misses
                    let numMisses = (currentBeat - beatTime) - lastBeat;
                    numMisses = numMisses / beatTime;
                    misses += numMisses;
                    
                    closestHitDelta = Math.abs(tap.delta);
                    lastBeat = currentBeat;
                }
            } 
            //Tap on the same beat
            else {
                console.log("Hit the same beat");
                //Check if current tap is closer
                if(closestHitDelta > Math.abs(tap.delta)){
                    closestHitDelta = Math.abs(tap.delta);
                }
                misses++;
            }
        });

        //Check if missed the last beat
        if(lastBeat != totalTime) {
            console.log("Missed the last beat");
            //Calculate the number of misses from the last beat
            let numMisses = totalTime - lastBeat;
            numMisses = numMisses / beatTime;
            misses += numMisses;
        }

        //Calculate the points loss from the number of missed beats
        let missPenalty = misses * beatTime;
        console.log("Miss Penalty: " + missPenalty + ", with " + misses + " misses");
        score -= missPenalty;
        score /= totalTime;

        if(score < 0) {
            score = 0;
        }

        return score;
    }
}
export default ScoreCalculator;