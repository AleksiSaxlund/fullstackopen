
const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	const reducer = (sum, item) => {
		return sum + item.likes
	}
	return blogs.length === 0
		? 0
		: blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
	if (blogs.length === 0) {
		return null
	}
	return blogs.reduce((max, current) => {
		return current.likes > max.likes
			? current
			: max
	})
}

module.exports = {
	dummy,
	totalLikes,
	favouriteBlog
}