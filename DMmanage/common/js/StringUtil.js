

function trim(content)
{
	content = content || "";
	return content.replace(/^\s* | \s*$/g,"");
}

module.exports = {
                    trim:trim
                }