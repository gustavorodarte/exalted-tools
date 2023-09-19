
import json

def search_keyword(file_path: str, keyword_knack: str, keyword_charm: str) -> list:
    
  keyword_tags = ["Cost:", "Mins:", "Type:", "Keywords:", "Duration:", "Prerequisite Charms:", "\n"]
  charms = []
  
  with open(file_path, "r") as file:
    lines = file.readlines()
      
  for i, line in enumerate(lines):
    if keyword_knack in line:
      charm = {}
      charm["Name"] = lines[i-2].strip()
      charm["Source"] = lines[i-1].strip()
      charm["Prerequisites"] = lines[i].strip()
      
      j = 1
      info =''
      while len(lines[i+j]) > 2:
        info += lines[i+j]+ ' '
        j +=1

      charm["Info"] = info.strip()
      
      charms.append(charm) 
      
  for i, line in enumerate(lines):
    if keyword_charm in line:
      charm = {}
      charm["Name"] = lines[i-2].strip()
      charm["Source"] = lines[i-1].strip()
      charm["Prerequisites"] = lines[i].strip()

      
      j = 0 
      for j in range(len(keyword_tags)-1):
        first_keyword_tag = keyword_tags[j]
        first_keyword_tag_index = line.find(first_keyword_tag)
        second_keyword_tag = keyword_tags[j+1]
        second_keyword_tag_index = line.find(second_keyword_tag)
        
        charm[first_keyword_tag[:-1]] = line[first_keyword_tag_index+len(first_keyword_tag):second_keyword_tag_index].strip()
      
      j = 1
      info =''
      while len(lines[i+j]) > 2:
        info += lines[i+j]+ ' '
        j +=1

      charm["Info"] = info.strip()
      
      charms.append(charm) 
          
  return charms

if __name__ == "__main__":
  file_path = "Charm_Lunar.txt"
  keyword_knack = "Prerequisites:"
  keyword_charm = "Cost:"
  charms = search_keyword(file_path, keyword_knack, keyword_charm)

  with open('Lunar_Solar.json', 'w') as json_file:
    json.dump(charms, json_file, indent=4)
