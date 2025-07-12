
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { TrendingUp, Award, ExternalLink, BookOpen } from 'lucide-react';
import sampleData from '../data/sampleData.json';

const SkillsAnalytics: React.FC = () => {
  const skillsData = sampleData.skillPerformance;
  const courses = sampleData.availableCourses;

  const handleNCSLogin = (courseLink: string) => {
    window.open(courseLink, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Skills Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Skills Performance
          </CardTitle>
          <CardDescription>
            Percentage of total earnings by skill category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {skillsData.map((skill, index) => (
              <div key={skill.skill} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium">{skill.skill}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      ₹{skill.totalEarnings.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {skill.earningsPercentage}% of total
                    </div>
                  </div>
                </div>
                <Progress value={skill.earningsPercentage} className="h-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Courses & Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Available Courses & Certifications
          </CardTitle>
          <CardDescription>
            Enhance your skills with these courses from NCS portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <Card key={course.id} className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      {course.certification && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Award className="w-3 h-3 mr-1" />
                          Certified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Provider:</span> {course.provider}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {course.duration}
                      </div>
                      <div>
                        <span className="font-medium">Level:</span> {course.level}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleNCSLogin(course.ncsLink)}
                      className="w-full"
                      variant="outline"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Enroll via NCS Portal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsAnalytics;
