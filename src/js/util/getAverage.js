export default function getAverage(nums) {
    return nums.reduce((a, b) => (a + b)) / nums.length;
}
