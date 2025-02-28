import re
import os

class FQNUtils:
	JS_STD_PREFIX = "JS_Std_lib"
	JS_STD_REFERRER_STRING = 'JavaScript_standard;.'

	RELATIVE_FILE_PATH_WITHIN_VARIANT_REGEX = re.compile(r'/hexcom/([^/]*)/(.*)')

	@staticmethod
	def addFQNPrefixForEvent(event):
		event['target'] = FQNUtils.getFQN(event['target'])
		event['referrer'] = FQNUtils.getFQN(event['referrer'])

	@staticmethod
	def getFQN(string):
		def isFQN(obj):
			string = str(obj)
			#FQ method names (standard or not) have a ;.
			if 'changes.txt' in string \
					or '.output' in string \
					or ';.' in string:
				return True
			#FQ file names
			if string.startswith("/hexcom") and string.endswith(";"):
				return True
			return False

		if isFQN(string):
			return 'L' + str(string)
		else:
			return string

	@staticmethod
	def getFullClassPath(filepath):
		if 'changes.txt' in filepath:
			return filepath
		#TODO: this currently does not handle non-JS files
		return filepath + ";"

	@staticmethod
	def getFullMethodPath(filepath, nested_path_within_file, header):
		fullClassPath = FQNUtils.getFullClassPath(filepath)
		if header == '': #This happens when a call site is not another method body -- JS specific!
			return fullClassPath

		else:
			return fullClassPath[:-1] + nested_path_within_file + ";." + header

	@staticmethod
	def getRelativeFilePathWithinVariant(src):
		match = FQNUtils.RELATIVE_FILE_PATH_WITHIN_VARIANT_REGEX.match(src)
		pathWithinVariant = match.groups()[1]
		return pathWithinVariant

	@staticmethod
	def correctJSStandardInvocationTargets(event, parentEventReferrer):
		if event['action'].startswith("Method invocation"):
			#Referrer has standard for method invocation
			#ParentEventReferrer has standard for Method invocation offset, length and scent methods.
			if FQNUtils.JS_STD_REFERRER_STRING in str(event['referrer'])\
					or (parentEventReferrer <> None and FQNUtils.JS_STD_REFERRER_STRING in parentEventReferrer):
				event['target'] = os.path.join(FQNUtils.JS_STD_PREFIX, event['target'])

	@staticmethod
	def normalizer(s):
		s = s.replace('\r\n', '\u00a')
		s = s.replace("\n", "\u00a")
		s = s.replace("\r", "\u00a")
		s = s.replace("'", "''")
		s = s.replace(",", "\",\"")
		return s

	@staticmethod
	def getVariantName(filename):
		regex = re.compile('/hexcom/([^/]*)/.*')
		match = regex.match(filename)
		if match == None:
			raise Exception("No such file: "+ filename)
		return match.groups()[0]