module.exports = async (tp) => {
    const frontmatter = tp.frontmatter;
    frontmatter.updated = tp.date.now("YYYY-MM-DD HH:mm:ss");
    await tp.file.save();
}
