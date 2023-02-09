var Individual  = artifacts.require('./Individual.sol');

contract('Individual', async account => {
    it("should create an individual", async () => {
        let instance = await Individual.deployed();
        let individualID = await instance.registerProvider("avi", "culloo", "Avi1906", "avi@gmail.com", "123");
        let individual = await instance.individuals(0);
        console.log(individualID);
        assert.equal(individual[1], "avi");
    });

    it("should return individual details", async() => {
        let instance = await Individual.deployed();
        let individualDetails = await instance.getIndividual();
        console.log(individualDetails);
        assert.equal(individualDetails,"Avi1906");
    });
});