import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { Company } from "@/app/career/page";

// 한글 폰트 등록 - TTF 형식 사용
Font.register({
  family: "NotoSansKR",
  src: "https://fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Regular.woff"
});

// PDF 스타일 정의
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontSize: 10,
    fontFamily: "NotoSansKR"
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold"
  },
  companySection: {
    marginBottom: 25
  },
  companyHeader: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginBottom: 10,
    borderRadius: 4
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4
  },
  companyInfo: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 2
  },
  projectContainer: {
    marginLeft: 15,
    marginBottom: 15
  },
  projectHeader: {
    backgroundColor: "#fafafa",
    padding: 8,
    marginBottom: 6,
    borderLeft: "3 solid #3b82f6",
    paddingLeft: 12
  },
  projectName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2
  },
  projectPeriod: {
    fontSize: 9,
    color: "#666666"
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
    color: "#374151"
  },
  overview: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 8
  },
  achievementItem: {
    fontSize: 9,
    lineHeight: 1.3,
    marginBottom: 3,
    paddingLeft: 10
  },
  techStackContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8
  },
  techStackItem: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    padding: "2 6",
    marginRight: 4,
    marginBottom: 2,
    borderRadius: 2,
    fontSize: 8
  },
  referenceItem: {
    fontSize: 8,
    color: "#2563eb",
    marginBottom: 2
  }
});

interface CareerPDFDocumentProps {
  careerData: Company[];
}

const CareerPDFDocument: React.FC<CareerPDFDocumentProps> = ({ careerData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Career Portfolio</Text>

      {careerData.map((company, companyIndex) => (
        <View key={companyIndex} style={styles.companySection}>
          {/* 회사 정보 */}
          <View style={styles.companyHeader}>
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.companyInfo}>Period: {company.period}</Text>
            <Text style={styles.companyInfo}>Position: {company.position}</Text>
            <Text style={styles.companyInfo}>Projects: {company.projects.length}</Text>
          </View>

          {/* 프로젝트 목록 */}
          {company.projects.map(project => (
            <View key={project.id} style={styles.projectContainer}>
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectPeriod}>{project.period}</Text>
              </View>

              {/* 프로젝트 개요 */}
              <Text style={styles.sectionTitle}>Project Overview</Text>
              <Text style={styles.overview}>{project.overview}</Text>

              {/* 기술 스택 */}
              {project.techStack && project.techStack.length > 0 && (
                <View>
                  <Text style={styles.sectionTitle}>Tech Stack</Text>
                  <View style={styles.techStackContainer}>
                    {project.techStack.map((tech, index) => (
                      <Text key={index} style={styles.techStackItem}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {/* 주요 성과 */}
              <Text style={styles.sectionTitle}>Key Achievements</Text>
              {project.achievements.map((achievement, index) => (
                <Text key={index} style={styles.achievementItem}>
                  • {achievement}
                </Text>
              ))}

              {/* 레퍼런스 링크 */}
              {project.references && project.references.length > 0 && (
                <View>
                  <Text style={styles.sectionTitle}>References</Text>
                  {project.references.map((reference, index) => (
                    <Text key={index} style={styles.referenceItem}>
                      {reference}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

export default CareerPDFDocument;
